const pool = require("../database/connection");

const obtenerGrupos = async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT id, nombre
            FROM grupos
            ORDER BY id
        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const obtenerListadoGrupo = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT
                a.id,
                a.folio,
                a.nombre,
                a.apellido_paterno,
                a.apellido_materno,
                a.curp,
                a.fecha_nacimiento,
                a.sexo,
                g.nombre AS grupo
            FROM alumnos a
            INNER JOIN grupos g
                ON g.id = a.grupo_id
            WHERE
                a.grupo_id = $1
            ORDER BY
                a.apellido_paterno,
                a.apellido_materno,
                a.nombre
        `, [id]);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
module.exports = {
    obtenerGrupos,
    obtenerListadoGrupo
};