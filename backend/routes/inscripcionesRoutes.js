const express = require("express");
const router = express.Router();

const {
    guardarInscripcion,
    obtenerGrupos,
    obtenerCiclos,
    obtenerInscripciones,
    obtenerExpediente,
    actualizarInformacionFamiliar,
    asignarGrupo,
    actualizarDocumentacion,
    obtenerAlumnos
} = require("../controllers/inscripcionesController");

router.get("/grupos", obtenerGrupos);
router.get("/ciclos", obtenerCiclos);
router.get("/", obtenerInscripciones);
router.get("/alumnos", obtenerAlumnos);
router.get("/:id", obtenerExpediente);

router.put(
    "/:id/informacion-familiar",
    actualizarInformacionFamiliar
);

router.put(
    "/:id/documentacion",
    actualizarDocumentacion
);

router.put(
    "/:id/grupo",
    asignarGrupo
);
router.post("/", guardarInscripcion);

module.exports = router;