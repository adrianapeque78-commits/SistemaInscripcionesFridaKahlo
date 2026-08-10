import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DocumentacionDocente() {

    const navigate = useNavigate();

    const [alumnos, setAlumnos] = useState([]);
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

        const cargarAlumnos = async () => {

            try {

                const respuesta = await fetch(
                    `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/alumnos?grupo_id=${usuario.grupo_id}`
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.mensaje || "Error al obtener alumnos"
                    );
                }

                setAlumnos(datos);

            } catch (error) {

                console.error(error);

                alert(
                    "No fue posible cargar los alumnos."
                );

            } finally {

                setCargando(false);

            }

        };

        cargarAlumnos();

    }, [navigate, usuario?.grupo_id, usuario?.rol_id]);

    if (cargando) {

        return (
            <div style={{ padding: "40px" }}>
                <h2>Cargando alumnos...</h2>
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

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px"
                }}
            >

                <div>

                    <h1 style={{ margin: 0 }}>
                        Mis alumnos
                    </h1>

                    <p
                        style={{
                            color: "#666",
                            margin: "10px 0 0 0"
                        }}
                    >
                        Grupo asignado:{" "}
                        <strong>
                            {usuario.grupo_id}
                        </strong>
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

            </div>

            {alumnos.length === 0 ? (

                <div
                    style={{
                        padding: "30px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >
                    <h3>
                        No hay alumnos asignados a este grupo.
                    </h3>
                </div>

            ) : (

                <div>

                    {alumnos.map((alumno) => (

                        <div
                            key={alumno.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                padding: "20px",
                                marginBottom: "15px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#fff"
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin:
                                            "0 0 8px 0"
                                    }}
                                >
                                    {alumno.nombre}{" "}
                                    {alumno.apellido_paterno}{" "}
                                    {alumno.apellido_materno}
                                </h2>

                                <p
                                    style={{
                                        margin: "5px 0",
                                        color: "#666"
                                    }}
                                >
                                    <strong>
                                        Folio:
                                    </strong>{" "}
                                    {alumno.folio}
                                </p>

                                <p
                                    style={{
                                        margin: "5px 0",
                                        color: "#666"
                                    }}
                                >
                                    <strong>
                                        Grupo:
                                    </strong>{" "}
                                    {alumno.grupo}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/dashboard-docente/alumno/${alumno.id}`
                                    )
                                }
                                style={{
                                    padding:
                                        "12px 20px",
                                    cursor: "pointer"
                                }}
                            >
                                👁️ Revisar expediente
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default DocumentacionDocente;