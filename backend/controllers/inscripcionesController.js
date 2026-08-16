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
const eliminarInscripcion = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const { id } = req.params;

        // Obtener los tutores relacionados con el alumno
        const tutoresResult = await client.query(
            `
            SELECT tutor_id
            FROM alumno_tutor
            WHERE alumno_id = $1
            `,
            [id]
        );

        const tutoresIds = tutoresResult.rows.map(
            fila => fila.tutor_id
        );

        // Eliminar contactos de emergencia
        await client.query(
            `
            DELETE FROM contactos_emergencia
            WHERE alumno_id = $1
            `,
            [id]
        );

        // Eliminar documentación
        await client.query(
            `
            DELETE FROM documentacion
            WHERE alumno_id = $1
            `,
            [id]
        );

        // Eliminar información de salud
        await client.query(
            `
            DELETE FROM salud
            WHERE alumno_id = $1
            `,
            [id]
        );

        // Eliminar domicilio
        await client.query(
            `
            DELETE FROM domicilios
            WHERE alumno_id = $1
            `,
            [id]
        );

        // Eliminar relaciones alumno-tutor
        await client.query(
            `
            DELETE FROM alumno_tutor
            WHERE alumno_id = $1
            `,
            [id]
        );

        // Eliminar los tutores creados para esta inscripción
        if (tutoresIds.length > 0) {

            await client.query(
                `
                DELETE FROM tutores
                WHERE id = ANY($1::int[])
                `,
                [tutoresIds]
            );

        }

        // Finalmente eliminar al alumno
        const alumnoResult = await client.query(
            `
            DELETE FROM alumnos
            WHERE id = $1
            RETURNING id, folio
            `,
            [id]
        );

        if (alumnoResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                mensaje: "Alumno no encontrado."
            });

        }

        await client.query("COMMIT");

        res.json({
            mensaje: "Inscripción eliminada correctamente.",
            folio: alumnoResult.rows[0].folio
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("ERROR AL ELIMINAR INSCRIPCIÓN:");
        console.error(error);

        res.status(500).json({
            mensaje: "No fue posible eliminar la inscripción.",
            error: error.message
        });

    } finally {

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
                a.grado_solicitado AS grado,
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
    a.tipo_inscripcion,
    a.grado_solicitado,
    a.ciclo_escolar_id,

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
   doc.curp AS curp_entregado,
   doc.hoja_asignacion,
   doc.curp_tutor,
   doc.reporte_evaluacion,
   doc.ine_madre,
   doc.ine_padre,
   doc.comprobante,
   doc.observaciones,

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

LEFT JOIN documentacion doc
ON doc.alumno_id = a.id

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

        const { alumno } = req.body;
        // ALUMNO
        await client.query(
            `
    UPDATE alumnos
    SET
        nombre = $1,
        apellido_paterno = $2,
        apellido_materno = $3,
        curp = $4,
        fecha_nacimiento = $5,
        sexo = $6,
        tipo_inscripcion = $7
    WHERE id = $8
    `,
            [
                alumno.nombre,
                alumno.apellidoPaterno,
                alumno.apellidoMaterno,
                alumno.curp,
                alumno.fechaNacimiento,
                alumno.sexo,
                alumno.tipo_inscripcion,
                id
            ]
        );
        // DOMICILIO
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

        // MADRE
        await client.query(
            `
            UPDATE tutores
            SET
                nombre = $1,
                curp = $2,
                telefono = $3,
                correo = $4,
                ocupacion = $5,
                escolaridad = $6
            WHERE id = (
                SELECT tutor_id
                FROM alumno_tutor
                WHERE alumno_id = $7
                AND parentesco = 'Madre'
            )
            `,
            [
                madre.nombre,
                madre.curp,
                madre.telefono,
                madre.correo,
                madre.ocupacion,
                madre.escolaridad,
                id
            ]
        );

        // PADRE
        await client.query(
            `
            UPDATE tutores
            SET
                nombre = $1,
                curp = $2,
                telefono = $3,
                correo = $4,
                ocupacion = $5,
                escolaridad = $6
            WHERE id = (
                SELECT tutor_id
                FROM alumno_tutor
                WHERE alumno_id = $7
                AND parentesco = 'Padre'
            )
            `,
            [
                padre.nombre,
                padre.curp,
                padre.telefono,
                padre.correo,
                padre.ocupacion,
                padre.escolaridad,
                id
            ]
        );

        // SALUD
        await client.query(
            `
    UPDATE salud
    SET
        tipo_sangre = $1,
        alergias = $2,
        padecimientos = $3,
        servicio_medico = $4,
        institucion = $5,
        numero_afiliacion = $6
    WHERE alumno_id = $7
    `,
            [
                salud.tipoSangre,
                salud.alergias,
                salud.padecimientos,
                salud.servicioMedico,
                salud.institucion,
                salud.numeroAfiliacion,
                id
            ]
        );

        // CONTACTOS DE EMERGENCIA
        for (const contacto of contactos || []) {

            await client.query(
                `
                UPDATE contactos_emergencia
                SET
                    nombre = $1,
                    parentesco = $2,
                    telefono = $3
                WHERE alumno_id = $4
                AND orden = $5
                `,
                [
                    contacto.nombre,
                    contacto.parentesco,
                    contacto.telefono,
                    id,
                    contacto.orden
                ]
            );

        }

        await client.query("COMMIT");

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
            hoja_asignacion,
            curp_tutor,
            reporte_evaluacion,
            ine_madre,
            ine_padre,
            comprobante_domicilio
        } = req.body;

        await pool.query(
            `
            UPDATE documentacion
            SET
                acta = $1,
                curp = $2,
                hoja_asignacion = $3,
                curp_tutor = $4,
                reporte_evaluacion = $5,
                ine_madre = $6,
                ine_padre = $7,
                comprobante = $8
            WHERE alumno_id = $9
            `,
            [
                acta_nacimiento,
                curp_entregado,
                hoja_asignacion,
                curp_tutor,
                reporte_evaluacion,
                ine_madre,
                ine_padre,
                comprobante_domicilio,
                id
            ]
        );

        res.json({
            mensaje: "Documentación actualizada correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: error.message
        });

    }

};
const obtenerAlumnos = async (req, res) => {
    console.log("### ENTRO A obtenerAlumnos NUEVA ###");
    try {

        const { grupo_id } = req.query;

        let consulta = `
            SELECT
                a.id,
                a.folio,
                a.nombre,
                a.apellido_paterno,
                a.apellido_materno,
                a.grado_solicitado AS grado,
                a.tipo_inscripcion,
                g.id AS grupo_id,
                g.nombre AS grupo,

                COALESCE(doc.acta, false) AS acta,
                COALESCE(doc.curp, false) AS curp,
                COALESCE(doc.curp_tutor, false) AS curp_tutor,
                COALESCE(doc.hoja_asignacion, false) AS hoja_asignacion,
                COALESCE(doc.ine_madre, false) AS ine_madre,
                COALESCE(doc.reporte_evaluacion, false) AS reporte_evaluacion,
                COALESCE(doc.ine_padre, false) AS ine_padre,
                COALESCE(doc.comprobante, false) AS comprobante

            FROM alumnos a

            INNER JOIN grupos g
                ON g.id = a.grupo_id

            LEFT JOIN documentacion doc
                ON doc.alumno_id = a.id
        `;

        const parametros = [];

        if (grupo_id) {

            consulta += `
                WHERE a.grupo_id = $1
            `;

            parametros.push(Number(grupo_id));

        }

        consulta += `
            ORDER BY a.apellido_paterno, a.apellido_materno, a.nombre
        `;

        const resultado = await pool.query(
            consulta,
            parametros
        );

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
    eliminarInscripcion,
    obtenerAlumnos
};