import "../styles/Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaClipboardList,
    FaChartBar,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const cerrarSesion = () => {

        localStorage.removeItem("usuario");
        navigate("/");

    };

    return (

        <aside className="sidebar">

            <div className="logo-panel">
                <img src="/logo.png" alt="Logo" className="logo-sidebar" />
                <h3>Frida Kahlo</h3>
            </div>

            <nav>

                <NavLink to="/dashboard" end>
                    <FaHome />
                    <span>Inicio</span>
                </NavLink>

                <NavLink to="/dashboard/preinscripciones">
                    <FaClipboardList />
                    <span>{usuario.rol_id === 1 ? "Inscripciones" : "Mis alumnos"}</span>
                </NavLink>

                {usuario.rol_id === 1 && (
                    <>
                        <NavLink to="/dashboard/alumnos">
                            <FaUserGraduate />
                            <span>Alumnos</span>
                        </NavLink>

                        <NavLink to="/dashboard/docentes">
                            <FaChalkboardTeacher />
                            <span>Docentes</span>
                        </NavLink>
                        <NavLink to="/dashboard/listados">
                            <FaChartBar />
                            <span>Listados</span>
                        </NavLink>
                        <NavLink to="/dashboard/reportes">
                            <FaChartBar />
                            <span>Reportes</span>
                        </NavLink>
                        
                        <NavLink to="/dashboard/configuracion">
                            <FaCog />
                            <span>Configuración</span>
                        </NavLink>
                    </>
                )}

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

export default Sidebar;



