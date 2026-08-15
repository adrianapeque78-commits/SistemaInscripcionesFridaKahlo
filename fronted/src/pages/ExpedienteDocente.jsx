import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ExpedienteDocente() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [alumno, setAlumno] = useState(null);
    const [cargando, setCargando] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {

        if (!usuario) {
            navigate("/");
            return;
        }

        if (usuario.rol_id !== 2) {
            navigate("/dashboard");
            return;
        }

        const cargarExpediente = async () => {

            try {

                const respuesta = await fetch(
                    `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}`
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.mensaje || "No fue posible obtener el expediente"
                    );
                }

                setAlumno(datos);

            } catch (error) {

                console.error(error);

                alert("No fue posible cargar el expediente.");

            } finally {

                setCargando(false);

            }

        };

        cargarExpediente();

    }, [id, navigate, usuario?.rol_id]);

    const actualizarDocumento = async (campo) => {

        if (!alumno) return;

        const nuevoValor = !Boolean(alumno[campo]);

        try {

            const datos = {
                acta_nacimiento:
                    campo === "acta"
                        ? nuevoValor
                        : Boolean(alumno.acta),

                curp_entregado:
                    campo === "curp"
                        ? nuevoValor
                        : Boolean(alumno.curp),

                cartilla_vacunacion:
                    campo === "hoja_asignacion"
                        ? nuevoValor
                        : Boolean(alumno.hoja_asignacion),

                ine_tutor:
                    campo === "ine_madre"
                        ? nuevoValor
                        : Boolean(alumno.ine_madre),

                comprobante_domicilio:
                    campo === "comprobante"
                        ? nuevoValor
                        : Boolean(alumno.comprobante)
            };

            const respuesta = await fetch(
                `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}/documentacion`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.mensaje || "No fue posible actualizar"
                );
            }

            setAlumno((anterior) => ({
                ...anterior,
                [campo]: nuevoValor
            }));

        } catch (error) {

            console.error(error);

            alert("No fue posible actualizar el documento.");

        }

    };

    if (cargando) {

        return (
            <div style={{ padding: "40px" }}>
                <h2>Cargando expediente...</h2>
            </div>
        );

    }

    if (!alumno) {

        return (
            <div style={{ padding: "40px" }}>
                <h2>No fue posible encontrar al alumno.</h2>

                <button
                    onClick={() =>
                        navigate("/dashboard-docente")
                    }
                >
                    ← Regresar
                </button>

            </div>
        );

    }

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1100px",
                margin: "0 auto"
            }}
        >

            {/* ENCABEZADO */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px"
                }}
            >

                <div>

                    <h1 style={{ margin: 0 }}>
                        Expediente del alumno
                    </h1>

                    <p
                        style={{
                            color: "#666",
                            margin: "8px 0 0 0"
                        }}
                    >
                        Folio: <strong>{alumno.folio}</strong>
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate("/dashboard-docente")
                    }
                    style={{
                        padding: "10px 18px",
                        cursor: "pointer"
                    }}
                >
                    ← Regresar
                </button>
                <button
                    onClick={() =>
                        navigate(`/dashboard-docente/alumno/${id}/editar`)
                    }
                    style={{
                        padding: "10px 18px",
                        cursor: "pointer",
                        marginLeft: "10px"
                    }}
                >
                    ✏️ Editar información
                </button>
            </div>

            {/* DATOS DEL ALUMNO */}

            <section
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h2>👧 Datos del alumno</h2>

                <p>
                    <strong>Nombre:</strong>{" "}
                    {alumno.nombre}{" "}
                    {alumno.apellido_paterno}{" "}
                    {alumno.apellido_materno}
                </p>

                <p>
                    <strong>CURP:</strong>{" "}
                    {alumno.curp || "No registrado"}
                </p>

                <p>
                    <strong>Sexo:</strong>{" "}
                    {alumno.sexo || "No registrado"}
                </p>

                <p>
                    <strong>Fecha de nacimiento:</strong>{" "}
                    {alumno.fecha_nacimiento
                        ? new Date(
                            alumno.fecha_nacimiento
                        ).toLocaleDateString("es-MX")
                        : "No registrada"}
                </p>

                <p>
                    <strong>Grupo:</strong>{" "}
                    {alumno.grupo || "Sin asignar"}
                </p>

                <p>
                    <strong>Ciclo escolar:</strong>{" "}
                    {alumno.ciclo || "Sin asignar"}
                </p>

            </section>

            {/* DOMICILIO */}

            <section
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h2>🏠 Domicilio</h2>

                <p>
                    <strong>Calle:</strong>{" "}
                    {alumno.calle || "No registrado"}
                </p>

                <p>
                    <strong>Número:</strong>{" "}
                    {alumno.numero || "No registrado"}
                </p>

                <p>
                    <strong>Colonia:</strong>{" "}
                    {alumno.colonia || "No registrada"}
                </p>

                <p>
                    <strong>Código postal:</strong>{" "}
                    {alumno.codigo_postal || "No registrado"}
                </p>

                <p>
                    <strong>Municipio:</strong>{" "}
                    {alumno.municipio || "No registrado"}
                </p>

                <p>
                    <strong>Estado:</strong>{" "}
                    {alumno.estado || "No registrado"}
                </p>

            </section>

            {/* MADRE */}

            <section
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h2>👩 Madre / tutora</h2>

                <p>
                    <strong>Nombre:</strong>{" "}
                    {alumno.madre_nombre || "No registrado"}
                </p>

                <p>
                    <strong>CURP:</strong>{" "}
                    {alumno.madre_curp || "No registrado"}
                </p>

                <p>
                    <strong>Teléfono:</strong>{" "}
                    {alumno.madre_telefono || "No registrado"}
                </p>

                <p>
                    <strong>Correo:</strong>{" "}
                    {alumno.madre_correo || "No registrado"}
                </p>

                <p>
                    <strong>Ocupación:</strong>{" "}
                    {alumno.madre_ocupacion || "No registrada"}
                </p>

                <p>
                    <strong>Escolaridad:</strong>{" "}
                    {alumno.madre_escolaridad || "No registrada"}
                </p>

            </section>

            {/* PADRE */}

            <section
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h2>👨 Padre / tutor</h2>

                <p>
                    <strong>Nombre:</strong>{" "}
                    {alumno.padre_nombre || "No registrado"}
                </p>

                <p>
                    <strong>CURP:</strong>{" "}
                    {alumno.padre_curp || "No registrado"}
                </p>

                <p>
                    <strong>Teléfono:</strong>{" "}
                    {alumno.padre_telefono || "No registrado"}
                </p>

                <p>
                    <strong>Correo:</strong>{" "}
                    {alumno.padre_correo || "No registrado"}
                </p>

                <p>
                    <strong>Ocupación:</strong>{" "}
                    {alumno.padre_ocupacion || "No registrada"}
                </p>

                <p>
                    <strong>Escolaridad:</strong>{" "}
                    {alumno.padre_escolaridad || "No registrada"}
                </p>

            </section>

            {/* SALUD */}

            <section
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h2>🩺 Salud</h2>

                <p>
                    <strong>Tipo de sangre:</strong>{" "}
                    {alumno.tipo_sangre || "No registrado"}
                </p>

                <p>
                    <strong>Alergias:</strong>{" "}
                    {alumno.alergias || "No registradas"}
                </p>

                <p>
                    <strong>Padecimientos:</strong>{" "}
                    {alumno.padecimientos || "No registrados"}
                </p>

                <p>
                    <strong>Servicio médico:</strong>{" "}
                    {alumno.servicio_medico || "No registrado"}
                </p>

                <p>
                    <strong>Institución:</strong>{" "}
                    {alumno.institucion || "No registrada"}
                </p>

                <p>
                    <strong>Número de afiliación:</strong>{" "}
                    {alumno.numero_afiliacion || "No registrado"}
                </p>

            </section>

            {/* CONTACTOS */}

            <section
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "20px"
                }}
            >

                <h2>☎ Contactos de emergencia</h2>

                {alumno.contactos &&
                    alumno.contactos.length > 0 ? (

                    alumno.contactos.map((contacto) => (

                        <div
                            key={contacto.orden}
                            style={{
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                padding: "15px",
                                marginBottom: "10px"
                            }}
                        >

                            <strong>
                                Contacto {contacto.orden}
                            </strong>

                            <p>
                                <strong>Nombre:</strong>{" "}
                                {contacto.nombre}
                            </p>

                            <p>
                                <strong>Parentesco:</strong>{" "}
                                {contacto.parentesco}
                            </p>

                            <p>
                                <strong>Teléfono:</strong>{" "}
                                {contacto.telefono}
                            </p>

                        </div>

                    ))

                ) : (

                    <p>
                        No hay contactos de emergencia registrados.
                    </p>

                )}

            </section>

            {/* DOCUMENTACIÓN */}

            <section
                style={{
                    border: "2px solid #1976d2",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "30px"
                }}
            >

                <h2>📄 Documentación física recibida</h2>

                <p style={{ color: "#666" }}>
                    Marca los documentos conforme sean
                    recibidos físicamente.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "12px"
                    }}
                >

                    <label
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            cursor: "pointer"
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={Boolean(alumno.acta)}
                            onChange={() =>
                                actualizarDocumento("acta")
                            }
                        />

                        {" "}Acta de nacimiento

                    </label>

                    <label
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            cursor: "pointer"
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={Boolean(alumno.curp)}
                            onChange={() =>
                                actualizarDocumento("curp")
                            }
                        />

                        {" "}CURP

                    </label>
<label
    style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        cursor: "pointer"
    }}
>
    <input
        type="checkbox"
        checked={Boolean(alumno.curp_tutor)}
        onChange={() =>
            actualizarDocumento("curp_tutor")
        }
    />

    {" "}CURP del tutor

</label>
                    <label
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            cursor: "pointer"
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={Boolean(
                                alumno.hoja_asignacion
                            )}
                            onChange={() =>
                                actualizarDocumento(
                                    "hoja_asignacion"
                                )
                            }
                        />

                        {" "}Hoja de asignación

                    </label>
<label
    style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        cursor: "pointer"
    }}
>
    <input
        type="checkbox"
        checked={Boolean(alumno.reporte_evaluacion)}
        onChange={() =>
            actualizarDocumento("reporte_evaluacion")
        }
    />

    {" "}Reporte de evaluación

</label>
                    <label
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            cursor: "pointer"
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={Boolean(alumno.ine_madre)}
                            onChange={() =>
                                actualizarDocumento(
                                    "ine_madre"
                                )
                            }
                        />

                        {" "}INE del tutor

                    </label>

                    <label
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            cursor: "pointer"
                        }}
                    >

                        <input
                            type="checkbox"
                            checked={Boolean(
                                alumno.comprobante
                            )}
                            onChange={() =>
                                actualizarDocumento(
                                    "comprobante"
                                )
                            }
                        />

                        {" "}Comprobante de domicilio

                    </label>

                </div>

            </section>

        </div>

    );
}

export default ExpedienteDocente;