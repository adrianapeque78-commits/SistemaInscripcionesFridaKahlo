function PasoPadre({ inscripcion, setInscripcion }) {

    const actualizarPadre = (campo, valor) => {

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
            padre: {
                ...inscripcion.padre,
                [campo]: valor
            }
        });
    };

    return (
        <>
            <h2>Datos del padre</h2>

            <div className="grid">

                <div>
                    <label>Nombre completo</label>
                    <input
                        type="text"
                        value={inscripcion.padre.nombre || ""}
                        onChange={(e) => actualizarPadre("nombre", e.target.value)}
                    />
                </div>

                <div>
                    <label>CURP</label>
                    <input
                        type="text"
                        value={inscripcion.padre.curp || ""}
                        onChange={(e) => actualizarPadre("curp", e.target.value)}
                    />
                </div>

                <div>
                    <label>Teléfono celular</label>
                    <input
                        type="text"
                        value={inscripcion.padre.telefono || ""}
                        onChange={(e) => actualizarPadre("telefono", e.target.value)}
                    />
                </div>

                <div>
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        value={inscripcion.padre.correo || ""}
                        onChange={(e) => actualizarPadre("correo", e.target.value)}
                    />
                </div>

                <div>
                    <label>Ocupación</label>
                    <input
                        type="text"
                        value={inscripcion.padre.ocupacion || ""}
                        onChange={(e) => actualizarPadre("ocupacion", e.target.value)}
                    />
                </div>

                <div>
                    <label>Último grado de estudios</label>
                    <input
                        type="text"
                        value={inscripcion.padre.escolaridad || ""}
                        onChange={(e) => actualizarPadre("escolaridad", e.target.value)}
                    />
                </div>

            </div>
        </>
    );
}

export default PasoPadre;