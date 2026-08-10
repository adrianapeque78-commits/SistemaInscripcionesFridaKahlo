import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function DashboardDocente() {

    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {

        if (!usuario) {
            navigate("/");
            return;
        }

        if (usuario.rol_id !== 2) {
            navigate("/dashboard");
        }

    }, [navigate, usuario?.rol_id]);

    return (

        <div style={{ padding: "40px" }}>

            <h1>Panel de Docente</h1>

            <h2>{usuario.nombre}</h2>

            <p>
                Grupo asignado:{" "}
                {usuario.grupo_id === 1
                    ? "1° A"
                    : usuario.grupo_id === 2
                        ? "1° B"
                        : usuario.grupo_id === 3
                            ? "2° A"
                            : usuario.grupo_id === 4
                                ? "2° B"
                                : usuario.grupo_id === 5
                                    ? "3° A"
                                    : usuario.grupo_id === 6
                                        ? "3° B"
                                        : "Sin asignar"}
            </p>

            <button
                onClick={() =>
                    navigate("/dashboard-docente/documentacion")
                }
                style={{
                    padding: "12px 20px",
                    marginTop: "20px",
                    cursor: "pointer"
                }}
            >
                📋 Documentación de alumnos
            </button>

            <br />
            <br />

            <button
                onClick={() => {
                    localStorage.removeItem("usuario");
                    navigate("/");
                }}
                style={{
                    padding: "10px 16px",
                    cursor: "pointer"
                }}
            >
                Cerrar sesión
            </button>

        </div>

    );
}

export default DashboardDocente;