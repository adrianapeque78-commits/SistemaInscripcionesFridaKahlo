import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function DashboardDocente() {

    const navigate = useNavigate();

    useEffect(() => {

        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario) {
            navigate("/");
            return;
        }

        if (usuario.rol_id !== 2) {
            navigate("/dashboard");
        }

    }, [navigate]);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    return (

        <div style={{ padding: "40px" }}>

            <h1>Panel de Docente</h1>

            <h2>{usuario.nombre}</h2>

            <p>Grupo asignado: {usuario.grupo_id}</p>

            <button
                onClick={() => {
                    localStorage.removeItem("usuario");
                    navigate("/");
                }}
            >
                Cerrar sesión
            </button>

        </div>

    );

}

export default DashboardDocente;