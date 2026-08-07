const express = require("express");
const router = express.Router();

const {
    obtenerGrupos,
    obtenerListadoGrupo
} = require("../controllers/listadosController");

router.get("/grupos", obtenerGrupos);
router.get("/grupo/:id", obtenerListadoGrupo);
module.exports = router;