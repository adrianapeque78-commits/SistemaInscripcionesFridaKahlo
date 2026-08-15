import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SidebarDocente from "../components/SidebarDocente";
function DocumentacionDocente() {
    const descargarPDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("JARDÍN DE NIÑOS FRIDA KAHLO", 105, 15, {
            align: "center"
        });

        doc.setFontSize(13);
        doc.text("Lista de alumnos", 105, 24, {
            align: "center"
        });

        doc.setFontSize(10);
        doc.text(`Docente: ${usuario.nombre}`, 14, 35);
        doc.text(`Grupo: ${usuario.grupo_id}`, 14, 42);
        doc.text(`Total de alumnos: ${alumnos.length}`, 14, 49);

        autoTable(doc, {
            startY: 57,
            head: [["No.", "Folio", "Alumno"]],
            body: alumnos.map((alumno, index) => [
                index + 1,
                alumno.folio || "",
                `${alumno.apellido_paterno || ""} ${alumno.apellido_materno || ""} ${alumno.nombre || ""}`.trim()
            ])
        });

        doc.save(
            `Lista_alumnos_grupo_${usuario.grupo_id}.pdf`
        );
    };
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
<div className="layout">
    <SidebarDocente />
    <main className="layout-content">
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
                        Documentación de alumnos
                    </h1>
<button
    onClick={descargarPDF}
    style={{
        marginTop: "15px",
        padding: "10px 18px",
        cursor: "pointer"
    }}
>
    📄 Descargar lista PDF
</button>
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

                <div style={{ overflowX: "auto" }}>

                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#fff"
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Alumno</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Acta de nacimiento</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>CURP</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>CURP del tutor</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Hoja de asignación</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Reporte de evaluación</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>INE del tutor</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>INE del papá</th>
                                <th style={{ padding: "12px", border: "1px solid #ddd" }}>Comprobante de domicilio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnos.map((alumno) => (
                                <tr key={alumno.id}>
                                    <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "600" }}>
                                        {alumno.apellido_paterno} {alumno.apellido_materno} {alumno.nombre}
                                    </td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.acta ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.curp ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.curp_tutor ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.hoja_asignacion ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.reporte_evaluacion ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.ine_madre ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.ine_padre ? "✓" : "—"}</td>
                                    <td style={{ textAlign: "center", border: "1px solid #ddd" }}>{alumno.comprobante ? "✓" : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>


            )}

       
        </div>

    </main>
</div>

    );
}

export default DocumentacionDocente;