/**
 * Rutas de eventos /events
 * host + /api/events
 */

const { Router } = require("express");
const { obtenerEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/eventsController");
const { validarJWT } = require("../middlewares/validarJWT");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { isDate } = require("../helpers/isDate");
const router = Router();

router.use(validarJWT);

router.get("/", obtenerEventos);
router.post(
    "/", 
    [
        check("title", "Título es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatorio").custom(isDate),
        check("end", "Fecha fin es obligatorio").custom(isDate),
        validarCampos
    ], 
    crearEvento
);
router.put(
    "/:id",
    [
        check("title", "Título es obligatorio").not().isEmpty(),
        check("start", "Fecha de inicio es obligatorio").custom(isDate),
        check("end", "Fecha fin es obligatorio").custom(isDate),
        check("id", "ID invalido").isMongoId(),
        validarCampos
    ],
    actualizarEvento
);
router.delete(
    "/:id", 
    [
        check("id", "ID invalido").isMongoId(),
        validarCampos
    ], 
    eliminarEvento
);

module.exports = router;