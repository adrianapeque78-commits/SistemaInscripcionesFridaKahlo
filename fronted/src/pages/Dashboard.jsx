import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import "../styles/Dashboard.css";

function Dashboard() {
    const [totalDocentes, setTotalDocentes] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {

        const usuario = localStorage.getItem("usuario");

        if (!usuario) {
            navigate("/");
        }

    }, [navigate]);
    useEffect(() => {

        fetch("https://sistemainscripcionesfridakahlo.onrender.com/docentes")
            .then(res => res.json())
            .then(data => {
                console.log("TOTAL DOCENTES EN DASHBOARD:", data.length);
                setTotalDocentes(data.length);
            })
            .catch(error => {
                console.error("Error al obtener docentes:", error);
            });

    }, []);
    const cerrarSesion = () => {

        localStorage.removeItem("usuario");

        navigate("/");

    };

    return (

        <div className="dashboard">

            <Sidebar />

            <main className="contenido">

                <div className="dashboard-header">

                    <div>

                        <h1 className="titulo-dashboard">
                            Directora
                        </h1>

                        <p className="subtitulo-dashboard">
                            Sistema Integral de Inscripciones
                        </p>

                    </div>

                    <button
                        onClick={cerrarSesion}
                        style={{
                            padding: "10px 18px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#b22222",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Cerrar sesión
                    </button>

                </div>

                <div className="cards">

                    <Card titulo="Alumnos" numero="162" />

                    <Card titulo="Docentes" numero={totalDocentes} />

                    <Card titulo="Grupos" numero="6" />

                    <Card titulo="Folios" numero="48" />

                </div>

            </main>

        </div>

    );
}

export default Dashboard;