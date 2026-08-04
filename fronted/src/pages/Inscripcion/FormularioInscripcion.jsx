import { useState } from "react";
import "../../styles/FormularioInscripcion.css";
import PasoAlumno from "../../components/inscripcion/PasoAlumno";
import PasoDomicilio from "../../components/inscripcion/PasoDomicilio";
import PasoMadre from "../../components/inscripcion/PasoMadre";
import PasoPadre from "../../components/inscripcion/PasoPadre";
import PasoEmergencias from "../../components/inscripcion/PasoEmergencias";
import PasoSalud from "../../components/inscripcion/PasoSalud";
import PasoDocumentacion from "../../components/inscripcion/PasoDocumentacion";
import PasoConfirmacion from "../../components/inscripcion/PasoConfirmacion";

function FormularioInscripcion() {

    const [paso, setPaso] = useState(1);

    const [inscripcion, setInscripcion] = useState({
        alumno: {
            tipo_inscripcion: "Nuevo ingreso",
            grado_solicitado: 1,
            grupo_id: null,
            ciclo_escolar_id: 1
        },

        domicilio: {},

        madre: {},

        padre: {},

        emergencias: [
            {
                nombre: "",
                parentesco: "",
                telefono: ""
            },
            {
                nombre: "",
                parentesco: "",
                telefono: ""
            },
            {
                nombre: "",
                parentesco: "",
                telefono: ""
            }
        ],

        salud: {},

        documentacion: {}
    });
    return (
        <div className="formulario">
            <div
                className="formulario"
                style={{ maxWidth: "900px", margin: "40px auto" }}
            ></div>
            <h1>Preinscripción Ciclo Escolar 2026-2027</h1>
            <p
                style={{
                    textAlign: "center",
                    color: "#666",
                    marginBottom: "25px"
                }}
            >
                Jardín de Niños Frida Kahlo
            </p>
            <p>Llene todos los campos para finalizar su preinscripción.</p>

            <div className="card-form">

                {paso === 1 && (
                    <PasoAlumno
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}
                {paso === 2 && (
                    <PasoDomicilio
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}
                {paso === 3 && (
                    <PasoMadre
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}
                {paso === 4 && (
                    <PasoPadre
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}
                {paso === 5 && (
                    <PasoEmergencias
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}
                {paso === 6 && (
                    <PasoSalud
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}
                {paso === 7 && (
                    <PasoDocumentacion
                        inscripcion={inscripcion}
                        setInscripcion={setInscripcion}
                    />
                )}

                {paso === 8 && (
                    <PasoConfirmacion
                        inscripcion={inscripcion}
                    />
                )}
            </div>
            <hr style={{ margin: "30px 0" }} />
            <div className="botones">

                <button
                    onClick={() => {
                        if (paso > 1) {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                            setPaso(paso - 1);
                        }
                    }}
                >
                    Anterior
                </button>

                <button
                    onClick={() => {
                        if (paso < 8) {
                            console.log("Paso:", paso, "Alumno:", inscripcion.alumno);
                            const validarPaso1 = () => {

                                if (!inscripcion.alumno.nombre?.trim()) {
                                    alert("Capture el nombre del alumno.");
                                    return false;
                                }

                                return true;
                                if (!inscripcion.alumno.apellidoPaterno?.trim()) {
                                    alert("Capture el apellido paterno del alumno.");
                                    return false;
                                }

                                if (!inscripcion.alumno.apellidoMaterno?.trim()) {
                                    alert("Capture el apellido materno del alumno.");
                                    return false;
                                }
                                if (!inscripcion.alumno.curp?.trim()) {
                                    alert("Capture la CURP del alumno.");
                                    return false;
                                }
                                if (!inscripcion.alumno.fechaNacimiento) {
                                    alert("Capture la fecha de nacimiento del alumno.");
                                    return false;
                                }
                                if (!inscripcion.alumno.sexo) {
                                    alert("Seleccione el sexo del alumno.");
                                    return false;
                                }
                                if (!inscripcion.alumno.grado_solicitado) {
                                    alert("Seleccione el grado solicitado.");
                                    return false;
                                }
                                if (!inscripcion.alumno.ciclo_escolar_id) {
                                    alert("Seleccione el ciclo escolar.");
                                    return false;
                                }
                            };
                            if (paso === 1 && !validarPaso1()) {

                                return;
                            }
                            window.scrollTo({
                                top: 0,


                                behavior: "smooth"
                            });

                            setPaso(paso + 1);
                        }
                    }}
                >
                    Siguiente
                </button>

            </div>

        </div >
    );
}

export default FormularioInscripcion;