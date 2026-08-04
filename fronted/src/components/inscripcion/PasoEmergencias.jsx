function PasoEmergencias({ inscripcion, setInscripcion }) {

    const actualizarContacto = (index, campo, valor) => {

        const contactos = [...inscripcion.emergencias];

        contactos[index][campo] = valor;

        setInscripcion({
            ...inscripcion,
            emergencias: contactos
        });

    };

    return (
        <>
            <h2>Contactos de emergencia</h2>

            <p>
                Capture las personas a quienes la escuela puede contactar en caso
                de una emergencia.
            </p>

            {inscripcion.emergencias.map((contacto, index) => (

                <div
                    key={index}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "20px"
                    }}
                >

                    <h3>Contacto de emergencia {index + 1}</h3>

                    <div className="grid">

                        <div>
                            <label>Nombre</label>

                            <input
                                type="text"
                                value={contacto.nombre}
                                onChange={(e) =>
                                    actualizarContacto(index, "nombre", e.target.value.toUpperCase())
                                }
                            />
                        </div>

                        <div>
                            <label>Parentesco</label>

                            <input
                                type="text"
                                value={contacto.parentesco}
                                onChange={(e) =>
                                    actualizarContacto(index, "parentesco", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label>Teléfono</label>

                            <input
                                type="text"
                                value={contacto.telefono}
                                onChange={(e) =>
                                    actualizarContacto(index, "telefono", e.target.value)
                                }
                            />
                        </div>

                    </div>

                </div>

            ))}

        </>
    );

}

export default PasoEmergencias;