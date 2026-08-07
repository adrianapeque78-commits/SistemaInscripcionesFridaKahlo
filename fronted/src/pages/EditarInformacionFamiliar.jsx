import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function EditarInformacionFamiliar() {

    const { id } = useParams();
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [alumno, setAlumno] = useState(null);
    const [guardando, setGuardando] = useState(false);
    console.log("ALUMNO:", alumno);
    useEffect(() => {

        fetch(`https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}`)
            .then(res => res.json())
            .then(data =>
                setAlumno({
                    ...data,
                    acta_nacimiento: data.acta,
                    curp_entregado: data.curp,
                    cartilla_vacunacion: data.hoja_asignacion,
                    ine_tutor: data.ine_madre,
                    comprobante_domicilio: data.comprobante
                })
            )
            .catch(err => console.error(err));

    }, [id]);

    if (!alumno) {
        return <h2 style={{ padding: "30px" }}>Cargando...</h2>;
    }

    return (

        <div style={{ padding: "30px" }}>

            <h1>
                {usuario.rol_id === 1
                    ? "Documentación"
                    : "Editar información familiar"}
            </h1>
            <hr />

            <h2>📄 Documentación</h2>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={alumno.acta_nacimiento || false}
                        onChange={(e) =>
                            setAlumno({
                                ...alumno,
                                acta_nacimiento: e.target.checked
                            })
                        }
                    />
                }
                label="Acta de nacimiento"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={alumno.curp_entregado || false}
                        onChange={(e) =>
                            setAlumno({
                                ...alumno,
                                curp_entregado: e.target.checked
                            })
                        }
                    />
                }
                label="CURP"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={alumno.cartilla_vacunacion || false}
                        onChange={(e) =>
                            setAlumno({
                                ...alumno,
                                cartilla_vacunacion: e.target.checked
                            })
                        }
                    />
                }
                label="Cartilla de vacunación"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={alumno.ine_tutor || false}
                        onChange={(e) =>
                            setAlumno({
                                ...alumno,
                                ine_tutor: e.target.checked
                            })
                        }
                    />
                }
                label="INE del tutor"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={alumno.comprobante_domicilio || false}
                        onChange={(e) =>
                            setAlumno({
                                ...alumno,
                                comprobante_domicilio: e.target.checked
                            })
                        }
                    />
                }
                label="Comprobante de domicilio"
            />

            <hr />
            <button
                onClick={() => navigate(`/dashboard/expediente/${id}`)}
            >
                {usuario.rol_id === 1 ? "Volver al expediente" : "Regresar"}
            </button>

            {usuario.rol_id === 1 && (
                <button
                    onClick={async () => {
                        const respuesta = await fetch(
                            `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}/documentacion`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    acta_nacimiento: alumno.acta_nacimiento,
                                    curp_entregado: alumno.curp_entregado,
                                    cartilla_vacunacion: alumno.cartilla_vacunacion,
                                    ine_tutor: alumno.ine_tutor,
                                    comprobante_domicilio: alumno.comprobante_domicilio
                                })
                            }
                        );

                        const datos = await respuesta.json();

                        alert(datos.mensaje);
                    }}
                >
                    Guardar documentación
                </button>
            )}
            <>

                <hr />
                <h2>📍 Domicilio</h2>

                <input
                    value={alumno.calle ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            calle: e.target.value
                        })
                    }
                    placeholder="Calle"
                />

                <br /><br />

                <input
                    value={alumno.numero ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            numero: e.target.value
                        })
                    }
                    placeholder="Número"
                />

                <br /><br />

                <input
                    value={alumno.colonia ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            colonia: e.target.value
                        })
                    }
                    placeholder="Colonia"
                />

                <hr />

                <h2>👩 Madre</h2>

                <input
                    value={alumno.madre_nombre ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            madre_nombre: e.target.value
                        })
                    }
                    placeholder="Nombre"
                />

                <br /><br />

                <input
                    value={alumno.madre_telefono ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            madre_telefono: e.target.value
                        })
                    }
                    placeholder="Teléfono"
                />

                <hr />

                <h2>👨 Padre</h2>

                <input
                    value={alumno.padre_nombre ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            padre_nombre: e.target.value
                        })
                    }
                    placeholder="Nombre"
                />

                <br /><br />

                <input
                    value={alumno.padre_telefono ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            padre_telefono: e.target.value
                        })
                    }
                    placeholder="Teléfono"
                />

                <hr />
                <h2>🩺 Salud</h2>

                <input
                    value={alumno.alergias ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            alergias: e.target.value
                        })
                    }
                    placeholder="Alergias"
                />

                <br /><br />

                <input
                    value={alumno.padecimientos ?? ""}
                    onChange={(e) =>
                        setAlumno({
                            ...alumno,
                            padecimientos: e.target.value
                        })
                    }
                    placeholder="Padecimientos"
                />

                <hr />

                <h2>☎ Contactos de Emergencia</h2>

                {alumno.contactos?.map((contacto, index) => (

                    <div
                        key={index}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            borderRadius: "8px",
                            marginBottom: "15px"
                        }}
                    >

                        <h4>Contacto {index + 1}</h4>

                        <input
                            value={contacto.nombre ?? ""}
                            onChange={(e) => {

                                const contactos = [...alumno.contactos];

                                contactos[index].nombre = e.target.value;

                                setAlumno({
                                    ...alumno,
                                    contactos
                                });

                            }}
                            placeholder="Nombre"
                        />

                        <br /><br />

                        <input
                            value={contacto.telefono ?? ""}
                            onChange={(e) => {

                                const contactos = [...alumno.contactos];

                                contactos[index].telefono = e.target.value;

                                setAlumno({
                                    ...alumno,
                                    contactos
                                });

                            }}
                            placeholder="Teléfono"
                        />

                    </div>

                ))}

                <hr />
                <button
                    type="button"
                    onClick={async () => {

                        setGuardando(true);

                        const respuesta = await fetch(

                            `https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/${id}/informacion-familiar`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
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
                                        telefono: alumno.madre_telefono
                                    },
                                    padre: {
                                        nombre: alumno.padre_nombre,
                                        telefono: alumno.padre_telefono
                                    },
                                    salud: {
                                        alergias: alumno.alergias,
                                        padecimientos: alumno.padecimientos
                                    },
                                    contactos: alumno.contactos
                                })
                            }
                        );

                        const datos = await respuesta.json();

                        alert(datos.mensaje);
                        navigate(`/dashboard/expediente/${id}`);
                        setGuardando(false);

                    }}
                >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </button>

            </>


        </div>
    );
}

export default EditarInformacionFamiliar;