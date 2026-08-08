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
                a.tipo_inscripcion,
                a.grado_solicitado,

                g.nombre AS grupo,

                d.calle,
                d.numero,
                d.colonia,
                d.codigo_postal,
                d.municipio,
                d.estado,

                tm.nombre AS madre_nombre,
                tm.curp AS madre_curp,
                tm.telefono AS madre_telefono,
                tm.correo AS madre_correo,
                tm.ocupacion AS madre_ocupacion,
                tm.escolaridad AS madre_escolaridad,

                tp.nombre AS padre_nombre,
                tp.curp AS padre_curp,
                tp.telefono AS padre_telefono,
                tp.correo AS padre_correo,
                tp.ocupacion AS padre_ocupacion,
                tp.escolaridad AS padre_escolaridad,

                s.tipo_sangre,
                s.alergias,
                s.padecimientos,
                s.servicio_medico,
                s.institucion,
                s.numero_afiliacion,

                doc.acta,
                doc.curp AS doc_curp,
                doc.hoja_asignacion,
                doc.ine_madre,
                doc.ine_padre,
                doc.comprobante,
                doc.observaciones,

                COALESCE(
                    (
                        SELECT json_agg(
                            json_build_object(
                                'nombre', ce.nombre,
                                'parentesco', ce.parentesco,
                                'telefono', ce.telefono,
                                'orden', ce.orden
                            )
                            ORDER BY ce.orden
                        )
                        FROM contactos_emergencia ce
                        WHERE ce.alumno_id = a.id
                    ),
                    '[]'::json
                ) AS contactos

            FROM alumnos a

            LEFT JOIN domicilios d
                ON d.alumno_id = a.id

            LEFT JOIN alumno_tutor atm
                ON atm.alumno_id = a.id
                AND atm.parentesco = 'Madre'

            LEFT JOIN tutores tm
                ON tm.id = atm.tutor_id

            LEFT JOIN alumno_tutor atp
                ON atp.alumno_id = a.id
                AND atp.parentesco = 'Padre'

            LEFT JOIN tutores tp
                ON tp.id = atp.tutor_id

            LEFT JOIN salud s
                ON s.alumno_id = a.id

            LEFT JOIN documentacion doc
                ON doc.alumno_id = a.id

            LEFT JOIN grupos g
                ON g.id = a.grupo_id

            WHERE a.grupo_id = $1

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