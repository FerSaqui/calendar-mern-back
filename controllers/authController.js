const { request, response } = require("express");
const UsuarioModel = require("../models/UsuarioModel");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req = request, res = response) => {
    const { email, password } = req.body;
    try {
        let usuario = await UsuarioModel.findOne({ email });
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: "Un usuario existe con ese correo"
            });
        }
        
        usuario = new UsuarioModel(req.body);

        //Cifrar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar jwt
        const token = await generarJWT(
            {
                uid: usuario.id,
                name: usuario.name
            }
        );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor, contacte al administrador"
        });
    }
};

const loginUsuario = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await UsuarioModel.findOne({ email });
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: "Usuario o contraseña incorrecto"
            });
        }

        //Confirmar las contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "Contraseña incorrecta"
            });
        }

        //Generar jwt
        const token = await generarJWT(
            {
                uid: usuario.id, 
                name: usuario.name
            }
        );

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Por favor, contacte al administrador"
        });
    }
};

const revalidarToken = async(req = request, res = response) => {
    const { uid, name } = req;

    //Generar un nuevo token
    const token = await generarJWT({ uid, name });

    res.json({
        ok: true,
        token,
        uid,
        name
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}