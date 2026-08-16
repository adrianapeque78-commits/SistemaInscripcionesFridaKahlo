import { useNavigate } from "react-router-dom";
import { FaHome, FaUserGraduate, FaFileAlt, FaSignOutAlt } from "react-icons/fa";

function SidebarDocente() {

    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    return (
        <aside className="sidebar">

            <div className="logo-panel">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="logo-sidebar"
                />

                <h3>Frida Kahlo</h3>
            </div>

            <nav>

                <button onClick={() => navigate("/dashboard-docente")}>
                    <FaHome />
                    <span>Inicio</span>
                </button>

                <button
                    onClick={() =>
                        navigate("/dashboard-docente/documentos")
                    }
                >
                    <FaFileAlt />
                    <span>Documentación</span>
                </button>

                <button
                    onClick={cerrarSesion}
                    className="logout-button"
                >
                    <FaSignOutAlt />
                    <span>Cerrar sesión</span>
                </button>

            </nav>

        </aside>
    );
}

export default SidebarDocente;