import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ExpedienteAlumno() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [alumno, setAlumno] = useState(null);
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log(alumno);
    console.log("CONTACTOS:", alumno?.contactos);

    useEffect(() => {
        fetch(`https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}`)
            .then((res) => res.json())
            .then((data) => {

                console.log("RESPUESTA DEL FETCH:", data);

                setAlumno(data);

            })
            .catch((err) => console.error(err));
    }, [id]);
    return (
        <div style={{ padding: "30px" }}>
            {!alumno ? (
                <h2>Cargando...</h2>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "30px"
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "36px",
                                    lineHeight: "1.2",
                                    fontWeight: "700"
                                }}
                            >
                                Expediente de Inscripción
                            </h1>

                            <p style={{ margin: "8px 0 0 0", color: "#666" }}>
                                Folio: {alumno.folio}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>

                            <button onClick={() => navigate("/dashboard/preinscripciones")}>
                                Regresar
                            </button>

                            {usuario.rol_id === 1 && (
                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/expediente/${id}/documentacion`)
                                    }
                                >
                                    Documentación
                                </button>
                            )}

                            {(usuario.rol_id === 1 || usuario.rol_id === 2) && (
                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/expediente/${id}/editar`)
                                    }
                                >
                                    Editar información
                                </button>
                            )}
                        </div>

                    </div>

                    <hr />

                    <h2>
                        {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
                    </h2>
                    <p><strong>Sexo:</strong> {alumno.sexo}</p>

                    <p>
                        <strong>Fecha de nacimiento:</strong>{" "}
                        {new Date(alumno.fecha_nacimiento).toLocaleDateString("es-MX")}
                    </p>

                    <p><strong>CURP:</strong> {alumno.curp || "No registrado"}</p>

                    <p><strong>Tipo:</strong> {alumno.tipo_inscripcion || "No registrado"}</p>

                    <p><strong>Grupo:</strong> {alumno.grupo ?? "Sin asignar"}</p>

                    <p><strong>Ciclo Escolar:</strong> {alumno.ciclo ?? "Sin asignar"}</p>

                    <hr />

                    <h3>📍 Domicilio</h3>

                    <p><strong>Calle:</strong> {alumno.calle}</p>

                    <p><strong>Número:</strong> {alumno.numero}</p>

                    <p><strong>Colonia:</strong> {alumno.colonia}</p>

                    <p><strong>Municipio:</strong> {alumno.municipio}</p>

                    <p><strong>Estado:</strong> {alumno.estado}</p>

                    <p><strong>Código Postal:</strong> {alumno.codigo_postal}</p>

                    <hr />

                    <h3>👩 Madre</h3>

                    <p><strong>Nombre:</strong> {alumno.madre_nombre}</p>

                    <p><strong>CURP:</strong> {alumno.madre_curp}</p>

                    <p><strong>Teléfono:</strong> {alumno.madre_telefono}</p>

                    <p><strong>Correo:</strong> {alumno.madre_correo}</p>

                    <p><strong>Ocupación:</strong> {alumno.madre_ocupacion}</p>

                    <p><strong>Escolaridad:</strong> {alumno.madre_escolaridad}</p>

                    <hr />

                    <h3>👨 Padre</h3>

                    <p><strong>Nombre:</strong> {alumno.padre_nombre}</p>

                    <p><strong>CURP:</strong> {alumno.padre_curp}</p>

                    <p><strong>Teléfono:</strong> {alumno.padre_telefono}</p>

                    <p><strong>Correo:</strong> {alumno.padre_correo}</p>

                    <p><strong>Ocupación:</strong> {alumno.padre_ocupacion}</p>

                    <p><strong>Escolaridad:</strong> {alumno.padre_escolaridad}</p>

                    <hr />

                    <h3>🩺 Salud</h3>

                    <p><strong>Tipo de sangre:</strong> {alumno.tipo_sangre}</p>

                    <p><strong>Alergias:</strong> {alumno.alergias}</p>

                    <p><strong>Padecimientos:</strong> {alumno.padecimientos}</p>

                    <p><strong>Servicio médico:</strong> {alumno.servicio_medico}</p>

                    <p><strong>Institución:</strong> {alumno.institucion}</p>

                    <p><strong>Número de afiliación:</strong> {alumno.numero_afiliacion}</p>

                    <hr />

                    <h3>☎ Contactos de Emergencia</h3>

                    {alumno.contactos && alumno.contactos.length > 0 ? (

                        alumno.contactos.map((contacto) => (

                            <div
                                key={contacto.orden}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "12px"
                                }}
                            >
                                <h4>Contacto {contacto.orden}</h4>

                                <p><strong>Nombre:</strong> {contacto.nombre}</p>

                                <p><strong>Parentesco:</strong> {contacto.parentesco}</p>

                                <p><strong>Teléfono:</strong> {contacto.telefono}</p>

                            </div>

                        ))

                    ) : (

                        <p>No hay contactos de emergencia registrados.</p>

                    )}

                </>
            )
            }
        </div >
    );
}

export default ExpedienteAlumno;
