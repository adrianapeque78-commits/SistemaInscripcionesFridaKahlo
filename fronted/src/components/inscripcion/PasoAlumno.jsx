import { useEffect, useState } from "react";
function PasoAlumno({ inscripcion, setInscripcion }) {
    const [ciclos, setCiclos] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {

            const respuestaCiclos = await fetch("http://localhost:3001/inscripciones/ciclos");
            const datosCiclos = await respuestaCiclos.json();

            setCiclos(datosCiclos);

        } catch (error) {
            console.error(error);
        }
    };
    const actualizarAlumno = (campo, valor) => {

        if (typeof valor === "string") {
            valor = valor.trimStart();
        }

        if (
            campo === "nombre" ||
            campo === "apellidoPaterno" ||
            campo === "apellidoMaterno"
        ) {
            valor = valor.toUpperCase();
        }

        if (campo === "curp") {
            valor = valor.toUpperCase();
        }

        setInscripcion({
            ...inscripcion,
            alumno: {
                ...inscripcion.alumno,
                [campo]: valor
            }
        });
    };
    return (
        <>
            <h2>Datos del alumno</h2>
            <div>
                <label>Seleccione una opción</label>

                <select
                    value={inscripcion.alumno.tipo_inscripcion || "Nuevo ingreso"}
                    onChange={(e) =>
                        actualizarAlumno("tipo_inscripcion", e.target.value)
                    }
                >
                    <option value="Nuevo ingreso">Nuevo ingreso</option>

                    <option value="Alumno de la casa">Alumno de la casa</option>
                </select>
            </div>
            <div className="grid">

                <div>
                    <label>Nombre(s)</label>
                    <input

                        type="text"
                        value={inscripcion.alumno.nombre || ""}
                        onChange={(e) => actualizarAlumno("nombre", e.target.value)}
                    />

                </div>

                <div>
                    <label>Apellido paterno</label>
                    <input
                        type="text"
                        value={inscripcion.alumno.apellidoPaterno || ""}
                        onChange={(e) =>
                            actualizarAlumno("apellidoPaterno", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Apellido materno</label>
                    <input
                        type="text"
                        value={inscripcion.alumno.apellidoMaterno || ""}
                        onChange={(e) =>
                            actualizarAlumno("apellidoMaterno", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>CURP</label>
                    <input
                        type="text"
                        value={inscripcion.alumno.curp || ""}
                        onChange={(e) =>
                            actualizarAlumno("curp", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Fecha de nacimiento</label>
                    <input
                        type="date"
                        value={inscripcion.alumno.fechaNacimiento || ""}
                        onChange={(e) =>
                            actualizarAlumno("fechaNacimiento", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Sexo</label>

                    <select
                        value={inscripcion.alumno.sexo || ""}
                        onChange={(e) =>
                            actualizarAlumno("sexo", e.target.value)
                        }
                    >
                        <option value="">Seleccionar</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                    </select>

                </div>
                <div>
                    <label>Grado solicitado</label>

                    <select
                        value={inscripcion.alumno.grado_solicitado || ""}
                        onChange={(e) =>
                            actualizarAlumno("grado_solicitado", Number(e.target.value))
                        }
                    >
                        <option value="">Seleccionar</option>
                        <option value={1}>1° de Preescolar</option>
                        <option value={2}>2° de Preescolar</option>
                        <option value={3}>3° de Preescolar</option>
                    </select>
                </div>

                <div>
                    <label>Ciclo escolar</label>

                    <select
                        value={inscripcion.alumno.ciclo_escolar_id || ""}
                        onChange={(e) =>
                            actualizarAlumno("ciclo_escolar_id", Number(e.target.value))
                        }
                    >
                        <option value="">Seleccionar</option>

                        {ciclos.map((ciclo) => (
                            <option key={ciclo.id} value={ciclo.id}>
                                {ciclo.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
}

export default PasoAlumno;