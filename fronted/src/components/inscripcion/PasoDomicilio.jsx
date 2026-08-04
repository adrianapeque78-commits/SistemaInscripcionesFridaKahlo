function PasoDomicilio({ inscripcion, setInscripcion }) {

    const actualizarDomicilio = (campo, valor) => {

        if (typeof valor === "string") {
            valor = valor.trimStart();
        }

        if (
            campo === "calle" ||
            campo === "colonia" ||
            campo === "municipio" ||
            campo === "estado"
        ) {
            valor = valor.toUpperCase();
        }

        setInscripcion({
            ...inscripcion,
            domicilio: {
                ...inscripcion.domicilio,
                [campo]: valor
            }
        });
    };

    return (
        <>
            <h2>Domicilio</h2>

            <div className="grid">

                <div>
                    <label>Calle</label>
                    <input
                        type="text"
                        value={inscripcion.domicilio.calle || ""}
                        onChange={(e) =>
                            actualizarDomicilio("calle", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Número</label>
                    <input
                        type="text"
                        value={inscripcion.domicilio.numero || ""}
                        onChange={(e) =>
                            actualizarDomicilio("numero", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Colonia</label>
                    <input
                        type="text"
                        value={inscripcion.domicilio.colonia || ""}
                        onChange={(e) =>
                            actualizarDomicilio("colonia", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Código Postal</label>
                    <input
                        type="text"
                        value={inscripcion.domicilio.codigoPostal || ""}
                        onChange={(e) =>
                            actualizarDomicilio("codigoPostal", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Municipio</label>
                    <input
                        type="text"
                        value={inscripcion.domicilio.municipio || ""}
                        onChange={(e) =>
                            actualizarDomicilio("municipio", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Estado</label>
                    <input
                        type="text"
                        value={inscripcion.domicilio.estado || ""}
                        onChange={(e) =>
                            actualizarDomicilio("estado", e.target.value)
                        }
                    />
                </div>

            </div>

        </>
    );
}

export default PasoDomicilio;