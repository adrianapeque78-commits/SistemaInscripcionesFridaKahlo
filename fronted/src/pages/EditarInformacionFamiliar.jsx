import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function EditarInformacionFamiliar() {

    const { id } = useParams();
    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log("USUARIO DOCENTE:", usuario);
    console.log("ROL DOCENTE:", usuario?.rol_id);
    const [alumno, setAlumno] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [guardandoDocumentacion, setGuardandoDocumentacion] = useState(false);

    useEffect(() => {

        if (!usuario) {
            navigate("/");
            return;
        }

        if (usuario.rol_id !== 1 && usuario.rol_id !== 2) {
            navigate("/dashboard");
            return;
        }

        const cargarAlumno = async () => {

            try {

                const respuesta = await fetch(
                    `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}`
                );

                const data = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        data.mensaje || "No fue posible obtener la información."
                    );
                }

                setAlumno({
                    ...data,

                    nombre: data.nombre || "",
                    apellido_paterno: data.apellido_paterno || "",
                    apellido_materno: data.apellido_materno || "",
                    curp: data.curp || "",
                    fecha_nacimiento: data.fecha_nacimiento
                        ? String(data.fecha_nacimiento).substring(0, 10)
                        : "",
                    sexo: data.sexo || "",
                    tipo_inscripcion: data.tipo_inscripcion || "",
                    grado_solicitado: data.grado_solicitado || data.grado || "",
                    ciclo_escolar_id: data.ciclo_escolar_id || "",

                    calle: data.calle || "",
                    numero: data.numero || "",
                    colonia: data.colonia || "",
                    codigo_postal: data.codigo_postal || "",
                    municipio: data.municipio || "",
                    estado: data.estado || "",

                    madre_nombre: data.madre_nombre || "",
                    madre_curp: data.madre_curp || "",
                    madre_telefono: data.madre_telefono || "",
                    madre_correo: data.madre_correo || "",
                    madre_ocupacion: data.madre_ocupacion || "",
                    madre_escolaridad: data.madre_escolaridad || "",

                    padre_nombre: data.padre_nombre || "",
                    padre_curp: data.padre_curp || "",
                    padre_telefono: data.padre_telefono || "",
                    padre_correo: data.padre_correo || "",
                    padre_ocupacion: data.padre_ocupacion || "",
                    padre_escolaridad: data.padre_escolaridad || "",

                    tipo_sangre: data.tipo_sangre || "",
                    alergias: data.alergias || "",
                    padecimientos: data.padecimientos || "",
                    servicio_medico: data.servicio_medico || "",
                    institucion: data.institucion || "",
                    numero_afiliacion: data.numero_afiliacion || "",

                    contactos: Array.isArray(data.contactos)
                        ? data.contactos
                        : [],

                    acta: Boolean(data.acta),
                    curp_entregado: Boolean(data.curp_entregado),
                    hoja_asignacion: Boolean(data.hoja_asignacion),
                    curp_tutor: Boolean(data.curp_tutor),
                    reporte_evaluacion: Boolean(data.reporte_evaluacion),
                    ine_madre: Boolean(data.ine_madre),
                    ine_padre: Boolean(data.ine_padre),
                    comprobante: Boolean(data.comprobante)
                });

            } catch (error) {

                console.error(error);
                alert("No fue posible cargar la información del alumno.");

            }

        };

        cargarAlumno();

    }, [id, navigate, usuario?.rol_id]);


    const actualizarCampo = (campo, valor) => {

        setAlumno(anterior => ({
            ...anterior,
            [campo]: valor
        }));

    };


    const actualizarContacto = (index, campo, valor) => {

        const contactos = [...alumno.contactos];

        contactos[index] = {
            ...contactos[index],
            [campo]: valor
        };

        setAlumno({
            ...alumno,
            contactos
        });

    };


    const regresarAlExpediente = () => {

        if (usuario.rol_id === 2) {
            navigate(`/dashboard-docente/alumno/${id}`);
        } else {
            navigate(`/dashboard/expediente/${id}`);
        }

    };


    const guardarDocumentacion = async () => {

        setGuardandoDocumentacion(true);

        try {

            const respuesta = await fetch(
                `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}/documentacion`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        acta_nacimiento: alumno.acta,
                        curp_entregado: alumno.curp_entregado,
                        hoja_asignacion: alumno.hoja_asignacion,
                        curp_tutor: alumno.curp_tutor,
                        reporte_evaluacion: alumno.reporte_evaluacion,
                        ine_madre: alumno.ine_madre,
                        ine_padre: alumno.ine_padre,
                        comprobante_domicilio: alumno.comprobante
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.mensaje || "No fue posible guardar la documentación."
                );
            }

            alert("Documentación actualizada correctamente.");

        } catch (error) {

            console.error(error);
            alert(error.message);

        } finally {

            setGuardandoDocumentacion(false);

        }

    };


    const guardarCambios = async () => {

        setGuardando(true);

        try {

            const respuesta = await fetch(
                `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}/informacion-familiar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        alumno: {
                            nombre: alumno.nombre,
                            apellidoPaterno: alumno.apellido_paterno,
                            apellidoMaterno: alumno.apellido_materno,
                            curp: alumno.curp,
                            fechaNacimiento: alumno.fecha_nacimiento,
                            sexo: alumno.sexo,
                            tipo_inscripcion: alumno.tipo_inscripcion,
                            gradoSolicitado: alumno.grado_solicitado,
                            cicloEscolarId: alumno.ciclo_escolar_id
                        },

                        domicilio: {
                            calle: alumno.calle,
                            numero: alumno.numero,
                            colonia: alumno.colonia,
                            codigoPostal: alumno.codigo_postal,
                            municipio: alumno.municipio,
                            estado: alumno.estado
                        },

                        madre: {
                            nombre: alumno.madre_nombre,
                            curp: alumno.madre_curp,
                            telefono: alumno.madre_telefono,
                            correo: alumno.madre_correo,
                            ocupacion: alumno.madre_ocupacion,
                            escolaridad: alumno.madre_escolaridad
                        },

                        padre: {
                            nombre: alumno.padre_nombre,
                            curp: alumno.padre_curp,
                            telefono: alumno.padre_telefono,
                            correo: alumno.padre_correo,
                            ocupacion: alumno.padre_ocupacion,
                            escolaridad: alumno.padre_escolaridad
                        },

                        salud: {
                            tipoSangre: alumno.tipo_sangre,
                            alergias: alumno.alergias,
                            padecimientos: alumno.padecimientos,
                            servicioMedico: alumno.servicio_medico,
                            institucion: alumno.institucion,
                            numeroAfiliacion: alumno.numero_afiliacion
                        },

                        contactos: alumno.contactos

                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.mensaje || "No fue posible guardar los cambios."
                );
            }

            alert("Información actualizada correctamente.");

            navigate(`/dashboard-docente/alumno/${id}`);

        } catch (error) {

            console.error(error);
            alert(error.message);

        } finally {

            setGuardando(false);

        }

    };


    if (!alumno) {

        return (
            <div style={{ padding: "40px" }}>
                <h2>Cargando información...</h2>
            </div>
        );

    }


    return (

        <div style={{
            padding: "30px",
            maxWidth: "1100px",
            margin: "0 auto"
        }}>

            <h1>Editar información del alumno</h1>

            <p>
                <strong>Folio:</strong> {alumno.folio}
            </p>

            <hr />


            {/* DATOS DEL ALUMNO */}

            <section>

                <h2>Datos del alumno</h2>

                <div className="grid">

                    <div>
                        <label>Tipo de inscripción</label>
                        <select
                            value={alumno.tipo_inscripcion}
                            onChange={e =>
                                actualizarCampo(
                                    "tipo_inscripcion",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">Seleccione</option>
                            <option value="Nuevo ingreso">
                                Nuevo ingreso
                            </option>
                            <option value="Alumno de la casa">
                                Alumno de la casa
                            </option>
                        </select>
                    </div>

                    <div>
                        <label>Nombre(s)</label>
                        <input
                            value={alumno.nombre}
                            onChange={e =>
                                actualizarCampo(
                                    "nombre",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Apellido paterno</label>
                        <input
                            value={alumno.apellido_paterno}
                            onChange={e =>
                                actualizarCampo(
                                    "apellido_paterno",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Apellido materno</label>
                        <input
                            value={alumno.apellido_materno}
                            onChange={e =>
                                actualizarCampo(
                                    "apellido_materno",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>CURP</label>
                        <input
                            value={alumno.curp}
                            onChange={e =>
                                actualizarCampo(
                                    "curp",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Fecha de nacimiento</label>
                        <input
                            type="date"
                            value={alumno.fecha_nacimiento}
                            onChange={e =>
                                actualizarCampo(
                                    "fecha_nacimiento",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Sexo</label>
                        <select
                            value={alumno.sexo}
                            onChange={e =>
                                actualizarCampo(
                                    "sexo",
                                    e.target.value
                                )
                            }
                        >
                            <option value="">Seleccione</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                        </select>
                    </div>

                    <div>
                        <label>Grado solicitado</label>
                        <select
                            value={alumno.grado_solicitado}
                            onChange={e =>
                                actualizarCampo(
                                    "grado_solicitado",
                                    Number(e.target.value)
                                )
                            }
                        >
                            <option value="">Seleccione</option>
                            <option value="1">1° de Preescolar</option>
                            <option value="2">2° de Preescolar</option>
                            <option value="3">3° de Preescolar</option>
                        </select>
                    </div>

                    <div>
                        <label>Ciclo escolar</label>
                        <input
                            value={alumno.ciclo || ""}
                            disabled
                        />
                    </div>

                </div>

            </section>


            <hr />


            {/* DOMICILIO */}

            <section>

                <h2>Domicilio</h2>

                <div className="grid">

                    <div>
                        <label>Calle</label>
                        <input
                            value={alumno.calle}
                            onChange={e =>
                                actualizarCampo(
                                    "calle",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Número</label>
                        <input
                            value={alumno.numero}
                            onChange={e =>
                                actualizarCampo(
                                    "numero",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Colonia</label>
                        <input
                            value={alumno.colonia}
                            onChange={e =>
                                actualizarCampo(
                                    "colonia",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Código Postal</label>
                        <input
                            value={alumno.codigo_postal}
                            onChange={e =>
                                actualizarCampo(
                                    "codigo_postal",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Municipio</label>
                        <input
                            value={alumno.municipio}
                            onChange={e =>
                                actualizarCampo(
                                    "municipio",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Estado</label>
                        <input
                            value={alumno.estado}
                            onChange={e =>
                                actualizarCampo(
                                    "estado",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                </div>

            </section>


            <hr />


            {/* MADRE */}

            <section>

                <h2>Datos de la madre / tutora</h2>

                <div className="grid">

                    <div>
                        <label>Nombre completo</label>
                        <input
                            value={alumno.madre_nombre}
                            onChange={e =>
                                actualizarCampo(
                                    "madre_nombre",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>CURP</label>
                        <input
                            value={alumno.madre_curp}
                            onChange={e =>
                                actualizarCampo(
                                    "madre_curp",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Teléfono</label>
                        <input
                            value={alumno.madre_telefono}
                            onChange={e =>
                                actualizarCampo(
                                    "madre_telefono",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            value={alumno.madre_correo}
                            onChange={e =>
                                actualizarCampo(
                                    "madre_correo",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Ocupación</label>
                        <input
                            value={alumno.madre_ocupacion}
                            onChange={e =>
                                actualizarCampo(
                                    "madre_ocupacion",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Último grado de estudios</label>
                        <input
                            value={alumno.madre_escolaridad}
                            onChange={e =>
                                actualizarCampo(
                                    "madre_escolaridad",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                </div>

            </section>


            <hr />


            {/* PADRE */}

            <section>

                <h2>Datos del padre / tutor</h2>

                <div className="grid">

                    <div>
                        <label>Nombre completo</label>
                        <input
                            value={alumno.padre_nombre}
                            onChange={e =>
                                actualizarCampo(
                                    "padre_nombre",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>CURP</label>
                        <input
                            value={alumno.padre_curp}
                            onChange={e =>
                                actualizarCampo(
                                    "padre_curp",
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Teléfono celular</label>
                        <input
                            value={alumno.padre_telefono}
                            onChange={e =>
                                actualizarCampo(
                                    "padre_telefono",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            value={alumno.padre_correo}
                            onChange={e =>
                                actualizarCampo(
                                    "padre_correo",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Ocupación</label>
                        <input
                            value={alumno.padre_ocupacion}
                            onChange={e =>
                                actualizarCampo(
                                    "padre_ocupacion",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Último grado de estudios</label>
                        <input
                            value={alumno.padre_escolaridad}
                            onChange={e =>
                                actualizarCampo(
                                    "padre_escolaridad",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                </div>

            </section>


            <hr />


            {/* CONTACTOS */}

            <section>

                <h2>Contactos de emergencia</h2>

                {alumno.contactos.map((contacto, index) => (

                    <div
                        key={contacto.orden || index}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "15px"
                        }}
                    >

                        <h3>
                            Contacto {index + 1}
                        </h3>

                        <div className="grid">

                            <div>
                                <label>Nombre</label>
                                <input
                                    value={contacto.nombre || ""}
                                    onChange={e =>
                                        actualizarContacto(
                                            index,
                                            "nombre",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                />
                            </div>

                            <div>
                                <label>Parentesco</label>
                                <input
                                    value={contacto.parentesco || ""}
                                    onChange={e =>
                                        actualizarContacto(
                                            index,
                                            "parentesco",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div>
                                <label>Teléfono</label>
                                <input
                                    value={contacto.telefono || ""}
                                    onChange={e =>
                                        actualizarContacto(
                                            index,
                                            "telefono",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>

                    </div>

                ))}

            </section>


            <hr />


            {/* SALUD */}

            <section>

                <h2>Datos de salud</h2>

                <div className="grid">

                    <div>
                        <label>Tipo de sangre</label>
                        <input
                            value={alumno.tipo_sangre}
                            onChange={e =>
                                actualizarCampo(
                                    "tipo_sangre",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Alergias</label>
                        <input
                            value={alumno.alergias}
                            onChange={e =>
                                actualizarCampo(
                                    "alergias",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Enfermedades o padecimientos</label>
                        <input
                            value={alumno.padecimientos}
                            onChange={e =>
                                actualizarCampo(
                                    "padecimientos",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>¿Cuenta con servicio médico?</label>
                        <input
                            value={alumno.servicio_medico}
                            onChange={e =>
                                actualizarCampo(
                                    "servicio_medico",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Institución de salud</label>
                        <input
                            value={alumno.institucion}
                            onChange={e =>
                                actualizarCampo(
                                    "institucion",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label>Número de afiliación</label>
                        <input
                            value={alumno.numero_afiliacion}
                            onChange={e =>
                                actualizarCampo(
                                    "numero_afiliacion",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                </div>

            </section>


            <hr />


            {/* DOCUMENTACIÓN */}

            <section
                style={{
                    border: "2px solid #1976d2",
                    borderRadius: "10px",
                    padding: "20px",
                    marginTop: "20px"
                }}
            >

                <h2>Documentación física recibida</h2>

                <p style={{ color: "#666" }}>
                    Marca los documentos conforme sean recibidos
                    físicamente en la escuela.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "10px"
                    }}
                >

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.acta}
                                onChange={e =>
                                    actualizarCampo(
                                        "acta",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Acta de nacimiento"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.curp_entregado}
                                onChange={e =>
                                    actualizarCampo(
                                        "curp_entregado",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="CURP del alumno"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.hoja_asignacion}
                                onChange={e =>
                                    actualizarCampo(
                                        "hoja_asignacion",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Hoja de asignación SEP"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.curp_tutor}
                                onChange={e =>
                                    actualizarCampo(
                                        "curp_tutor",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="CURP del tutor"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.reporte_evaluacion}
                                onChange={e =>
                                    actualizarCampo(
                                        "reporte_evaluacion",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Reporte de evaluación"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.ine_madre}
                                onChange={e =>
                                    actualizarCampo(
                                        "ine_madre",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="INE del tutor"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.ine_padre}
                                onChange={e =>
                                    actualizarCampo(
                                        "ine_padre",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="INE del padre"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={alumno.comprobante}
                                onChange={e =>
                                    actualizarCampo(
                                        "comprobante",
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Comprobante de domicilio"
                    />

                </div>

                <button
                    type="button"
                    onClick={guardarDocumentacion}
                    disabled={guardandoDocumentacion}
                    style={{
                        marginTop: "20px",
                        padding: "10px 18px",
                        cursor: guardandoDocumentacion
                            ? "default"
                            : "pointer"
                    }}
                >
                    {guardandoDocumentacion
                        ? "Guardando documentación..."
                        : "Guardar documentación"}
                </button>

            </section>


            <hr />


            {/* BOTONES */}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "25px",
                    marginBottom: "40px"
                }}
            >

                <button
                    type="button"
                    onClick={regresarAlExpediente}
                    style={{
                        padding: "12px 20px",
                        cursor: "pointer"
                    }}
                >
                    ← Regresar al expediente
                </button>

                <button
                    type="button"
                    onClick={guardarCambios}
                    disabled={guardando}
                    style={{
                        padding: "12px 20px",
                        cursor: guardando
                            ? "default"
                            : "pointer"
                    }}
                >
                    {guardando
                        ? "Guardando cambios..."
                        : "Guardar cambios"}
                </button>

            </div>

        </div>

    );

}

export default EditarInformacionFamiliar;