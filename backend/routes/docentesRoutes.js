const express = require("express");
const router = express.Router();
const pool = require("../database/connection");

router.get("/", async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                u.id,
                u.nombre,
                u.usuario,
                g.nombre AS grupo,
                CASE
                    WHEN u.rol_id = 1 THEN 'Directora'
                    ELSE 'Docente'
                END AS rol,
                CASE
                    WHEN u.activo THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM usuarios u
            LEFT JOIN grupos g
                ON g.id = u.grupo_id
            WHERE u.rol_id = 2
            ORDER BY u.nombre
        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});
router.post("/", async (req, res) => {

    try {

        const {
            nombre,
            usuario,
            password,
            grupo_id,
            rol_id
        } = req.body;

        await pool.query(
            `
            INSERT INTO usuarios
            (
                nombre,
                usuario,
                password,
                rol_id,
                activo,
                grupo_id
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                TRUE,
                $5
            )
            `,
            [
                nombre,
                usuario,
                password,
                rol_id,
                grupo_id
            ]
        );

        res.json({
            mensaje: "Docente registrado correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            `
            SELECT
                id,
                nombre,
                usuario,
                grupo_id,
                rol_id
            FROM usuarios
            WHERE id = $1
            `,
            [id]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                mensaje: "Docente no encontrado."
            });

        }

        res.json(resultado.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});
router.put("/:id", async (req, res) => {

    try {

        console.log("ENTRÓ AL PUT");

        const { id } = req.params;

        const {
            nombre,
            usuario,
            grupo_id
        } = req.body;

        await pool.query(
            `
            UPDATE usuarios
            SET
                nombre = $1,
                usuario = $2,
                grupo_id = $3
            WHERE id = $4
            `,
            [
                nombre,
                usuario,
                grupo_id,
                id
            ]
        );

        res.json({
            mensaje: "Docente actualizado correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});

router.put("/:id/password", async (req, res) => {

    try {

        const { id } = req.params;
        const { password } = req.body;

        await pool.query(
            `
            UPDATE usuarios
            SET password = $1
            WHERE id = $2
            `,
            [
                password,
                id
            ]
        );

        res.json({
            mensaje: "Contraseña actualizada correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});
router.put("/:id/estado", async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            `
            UPDATE usuarios
            SET activo = NOT activo
            WHERE id = $1
            RETURNING activo
            `,
            [id]
        );

        res.json({
            mensaje: resultado.rows[0].activo
                ? "Docente activado correctamente."
                : "Docente inactivado correctamente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

});
module.exports = router;