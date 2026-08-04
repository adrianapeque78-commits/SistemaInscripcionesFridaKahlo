function PasoMadre({ inscripcion, setInscripcion }) {

    const actualizarMadre = (campo, valor) => {

        if (typeof valor === "string") {
            valor = valor.trimStart();
        }

        if (campo === "nombre") {
            valor = valor.toUpperCase();
        }

        if (campo === "curp") {
            valor = valor.toUpperCase();
        }

        setInscripcion({
            ...inscripcion,
            madre: {
                ...inscripcion.madre,
                [campo]: valor
            }
        });
    };

    return (
        <>
            <h2>Datos de la madre</h2>

            <div className="grid">

                <div>
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        value={inscripcion.madre.nombre || ""}
                        onChange={(e) =>
                            actualizarMadre("nombre", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>CURP</label>
                    <input
                        type="text"
                        value={inscripcion.madre.curp || ""}
                        onChange={(e) =>
                            actualizarMadre("curp", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Teléfono</label>
                    <input
                        type="text"
                        value={inscripcion.madre.telefono || ""}
                        onChange={(e) =>
                            actualizarMadre("telefono", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        value={inscripcion.madre.correo || ""}
                        onChange={(e) =>
                            actualizarMadre("correo", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Ocupación</label>
                    <input
                        type="text"
                        value={inscripcion.madre.ocupacion || ""}
                        onChange={(e) =>
                            actualizarMadre("ocupacion", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Último grado de estudios</label>
                    <input
                        type="text"
                        value={inscripcion.madre.escolaridad || ""}
                        onChange={(e) =>
                            actualizarMadre("escolaridad", e.target.value)
                        }
                    />
                </div>

            </div>

        </>
    );
}

export default PasoMadre;