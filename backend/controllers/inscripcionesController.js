const pool = require("../database/connection");

const guardarInscripcion = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const {
            alumno,
            domicilio,
            madre,
            padre,
            emergencias,
            salud,
            documentacion
        } = req.body;

        // ==========================
        // ALUMNO
        // ==========================
        const alumnoResult = await client.query(
            `
    INSERT INTO alumnos
    (
        tipo_inscripcion,
        nombre,
        apellido_paterno,
        apellido_materno,
        curp,
        fecha_nacimiento,
        sexo,
        grado_solicitado,
        grupo_id,
        ciclo_escolar_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING id, folio;
    `,
            [
                alumno.tipo_inscripcion,
                alumno.nombre,
                alumno.apellidoPaterno,
                alumno.apellidoMaterno,
                alumno.curp,
                alumno.fechaNacimiento,
                alumno.sexo,
                alumno.grado_solicitado,
                null,
                alumno.ciclo_escolar_id
            ]
        );

        const alumnoId = alumnoResult.rows[0].id;

        // ==========================
        // DOMICILIO
        // ==========================
        await client.query(
            `
            INSERT INTO domicilios
            (
                alumno_id,
                calle,
                numero,
                colonia,
                codigo_postal,
                municipio,
                estado
            )
            VALUES($1, $2, $3, $4, $5, $6, $7)
                `,
            [
                alumnoId,
                domicilio.calle,
                domicilio.numero,
                domicilio.colonia,
                domicilio.codigoPostal,
                domicilio.municipio,
                domicilio.estado
            ]
        );

        // ==========================
        // MADRE
        // ==========================
        const madreResult = await client.query(
            `
            INSERT INTO tutores
            (
                nombre,
                curp,
                telefono,
                correo,
                ocupacion,
                escolaridad
            )
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `,
            [
                madre.nombre,
                madre.curp,
                madre.telefono,
                madre.correo,
                madre.ocupacion,
                madre.escolaridad
            ]
        );

        const madreId = madreResult.rows[0].id;

        await client.query(
            `
            INSERT INTO alumno_tutor
            (
                alumno_id,
                tutor_id,
                parentesco,
                es_principal
            )
        VALUES($1, $2, $3, $4)
            `,
            [
                alumnoId,
                madreId,
                "Madre",
                true
            ]
        );

        // ==========================
        // PADRE
        // ==========================
        const padreResult = await client.query(
            `
            INSERT INTO tutores
            (
                nombre,
                curp,
                telefono,
                correo,
                ocupacion,
                escolaridad
            )
        VALUES($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `,
            [
                padre.nombre,
                padre.curp,
                padre.telefono,
                padre.correo,
                padre.ocupacion,
                padre.escolaridad
            ]
        );

        const padreId = padreResult.rows[0].id;
        // ==========================
        // CONTACTOS DE EMERGENCIA
        // ==========================
        for (let i = 0; i < emergencias.length; i++) {

            await client.query(
                `
        INSERT INTO contactos_emergencia
        (
            alumno_id,
            nombre,
            parentesco,
            telefono,
            orden
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
                [
                    alumnoId,
                    emergencias[i].nombre,
                    emergencias[i].parentesco,
                    emergencias[i].telefono,
                    i + 1
                ]
            );

        }
        // ==========================
        // SALUD
        // ==========================
        await client.query(
            `
    INSERT INTO salud
    (
        alumno_id,
        tipo_sangre,
        alergias,
        padecimientos,
        servicio_medico,
        institucion,
        numero_afiliacion,
        medico_tratante
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
                alumnoId,
                salud.tipoSangre,
                salud.alergias,
                salud.padecimientos,
                salud.servicioMedico,
                salud.institucion,
                salud.numeroAfiliacion,
                null
            ]
        );

        // ==========================
        // DOCUMENTACIÓN
        // ==========================
        await client.query(
            `
    INSERT INTO documentacion
    (
        alumno_id,
        acta,
        curp,
        hoja_asignacion,
        ine_madre,
        ine_padre,
        comprobante,
        observaciones
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `,
            [
                alumnoId,
                documentacion.acta,
                documentacion.curp,
                documentacion.hojaAsignacion,
                documentacion.ineMadre,
                documentacion.inePadre,
                documentacion.comprobante,
                documentacion.observaciones
            ]
        );

        await client.query(
            `
    INSERT INTO alumno_tutor
    (
        alumno_id,
        tutor_id,
        parentesco,
        es_principal
    )
    VALUES($1, $2, $3, $4)
    `,
            [
                alumnoId,
                padreId,
                "Padre",
                false
            ]
        );
        await client.query(
            `
    UPDATE alumnos
    SET folio = 'FK-' || LPAD(id:: text, 6, '0')
    WHERE id = $1
            `,
            [alumnoId]
        );
        await client.query("COMMIT");

        const folio = `FK-${String(alumnoId).padStart(6, "0")}`;

        res.status(201).json({
            mensaje: "Inscripción guardada correctamente",
            alumnoId,
            folio
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("=================================");
        console.error("ERROR AL GUARDAR INSCRIPCIÓN");
        console.error(error);
        console.error("=================================");

        res.status(500).json({
            mensaje: error.message,
            stack: error.stack
        });

    }
    finally {
        client.release();
    }

};

const obtenerGrupos = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT id, nombre FROM grupos ORDER BY id"
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener grupos" });
    }
};

const obtenerCiclos = async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT id, nombre FROM ciclos_escolares WHERE activo = TRUE ORDER BY id"
        );

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al obtener ciclos escolares"
        });
    }
};
const obtenerInscripciones = async (req, res) => {

    try {

        const { grupo_id } = req.query;

        let consulta = `
            SELECT
                a.id,
                a.folio,
                CONCAT(
                    a.nombre,' ',
                    a.apellido_paterno,' ',
                    a.apellido_materno
                ) AS nombre,
                g.nombre AS grupo,
                CASE
                    WHEN a.grupo_id IS NULL THEN 'Pendiente'
                    ELSE 'Asignado'
                END AS estado
            FROM alumnos a
            LEFT JOIN grupos g
                ON g.id = a.grupo_id
        `;

        const parametros = [];

        if (grupo_id) {

            consulta += `
                WHERE a.grupo_id = $1
            `;

            parametros.push(Number(grupo_id));

        }

        consulta += `
            ORDER BY a.id DESC
        `;

        console.log("Grupo recibido:", grupo_id);

        const resultado = await pool.query(
            consulta,
            parametros
        );

        console.log("Alumnos encontrados:", resultado.rows.length);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const obtenerExpediente = async (req, res) => {

    try {

        const { id } = req.params;

        const resultado = await pool.query(
            `
            SELECT
    a.id,
    a.folio,
    a.nombre,
    a.apellido_paterno,
    a.apellido_materno,
    a.curp,
    a.fecha_nacimiento,
    a.sexo,

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

    g.nombre AS grupo,
    c.nombre AS ciclo

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

LEFT JOIN grupos g
    ON g.id = a.grupo_id

LEFT JOIN ciclos_escolares c
    ON c.id = a.ciclo_escolar_id

WHERE a.id = $1
            `,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        const contactos = await pool.query(
            `
    SELECT
        nombre,
        parentesco,
        telefono,
        orden
    FROM contactos_emergencia
    WHERE alumno_id = $1
    ORDER BY orden
    `,
            [id]
        );

        console.log({
            ...resultado.rows[0],
            contactos: contactos.rows
        });

        res.json({
            ...resultado.rows[0],
            contactos: contactos.rows
        });
    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};

const actualizarInformacionFamiliar = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const { id } = req.params;

        const {
            domicilio,
            madre,
            padre,
            salud,
            contactos
        } = req.body;

        await client.query(
            `
            UPDATE domicilios
            SET
                calle = $1,
                numero = $2,
                colonia = $3,
                codigo_postal = $4,
                municipio = $5,
                estado = $6
            WHERE alumno_id = $7
            `,
            [
                domicilio.calle,
                domicilio.numero,
                domicilio.colonia,
                domicilio.codigoPostal,
                domicilio.municipio,
                domicilio.estado,
                id
            ]
        );
        await client.query(
            `
    UPDATE tutores
    SET
        nombre = $1,
        telefono = $2
    WHERE id = (
        SELECT tutor_id
        FROM alumno_tutor
        WHERE alumno_id = $3
        AND parentesco = 'Madre'
    )
    `,
            [
                madre.nombre,
                madre.telefono,
                id
            ]
        );
        await client.query(
            `
    UPDATE tutores
    SET
        nombre = $1,
        telefono = $2
    WHERE id = (
        SELECT tutor_id
        FROM alumno_tutor
        WHERE alumno_id = $3
        AND parentesco = 'Padre'
    )
    `,
            [
                padre.nombre,
                padre.telefono,
                id
            ]
        );
        await client.query(
            `
    UPDATE salud
    SET
        alergias = $1,
        padecimientos = $2
    WHERE alumno_id = $3
    `,
            [
                salud.alergias,
                salud.padecimientos,
                id
            ]
        );
        for (const contacto of contactos) {

            await client.query(
                `
        UPDATE contactos_emergencia
        SET
            nombre = $1,
            telefono = $2
        WHERE alumno_id = $3
        AND orden = $4
        `,
                [
                    contacto.nombre,
                    contacto.telefono,
                    id,
                    contacto.orden
                ]
            );

        }
        await client.query("COMMIT");
        const resultado = await client.query(
            "SELECT * FROM domicilios WHERE alumno_id = $1",
            [id]
        );

        console.log(resultado.rows[0]);

        res.json({
            mensaje: "Información actualizada correctamente"
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    } finally {

        client.release();

    }

};
const asignarGrupo = async (req, res) => {

    try {
        const { id } = req.params;
        const { grupo_id } = req.body;
        await pool.query(
            `
    UPDATE alumnos
    SET grupo_id = $1
    WHERE id = $2
    `,
            [grupo_id, id]
        );
        res.json({
            mensaje: "Grupo asignado correctamente."
        });
        res.json({
            mensaje: "Función asignarGrupo pendiente."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const actualizarDocumentacion = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            acta_nacimiento,
            curp_entregado,
            cartilla_vacunacion,
            ine_tutor,
            comprobante_domicilio,
        } = req.body;

        await pool.query(
            `
            UPDATE alumnos
            SET
                acta_nacimiento = $1,
                curp_entregado = $2,
                cartilla_vacunacion = $3,
                ine_tutor = $4,
                comprobante_domicilio = $5
                
            WHERE id = $6
            `,
            [
                acta_nacimiento,
                curp_entregado,
                cartilla_vacunacion,
                ine_tutor,
                comprobante_domicilio,

                id
            ]
        );

        res.json({
            mensaje: "Documento entregado"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const obtenerAlumnos = async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                a.id,
                a.folio,
                CONCAT(
                    a.nombre,' ',
                    a.apellido_paterno,' ',
                    a.apellido_materno
                ) AS nombre,
                g.nombre AS grupo
            FROM alumnos a
            INNER JOIN grupos g
                ON g.id = a.grupo_id
            ORDER BY g.nombre, a.apellido_paterno, a.nombre
        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
module.exports = {
    guardarInscripcion,
    obtenerGrupos,
    obtenerCiclos,
    obtenerInscripciones,
    obtenerExpediente,
    actualizarInformacionFamiliar,
    asignarGrupo,
    actualizarDocumentacion,
    obtenerAlumnos
};