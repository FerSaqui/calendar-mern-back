/**
 * Rutas de usuarios /auth
 * host + /api/auth
 */

const { Router } = require("express");
const { crearUsuario, loginUsuario, revalidarToken } = require("../controllers/authController");
const router = Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { validarJWT } = require("../middlewares/validarJWT");

router.post(
    "/register",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe de ser de 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
);

router.post(
    "/", 
    [
        check("email", "El email es obligatorio").isEmail(),
        check("password", "La contraseña debe de ser de 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ], 
    loginUsuario
);

router.get("/renew", validarJWT , revalidarToken);

module.exports = router;