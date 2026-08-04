function PasoSalud({ inscripcion, setInscripcion }) {

    const actualizarSalud = (campo, valor) => {
        setInscripcion({
            ...inscripcion,
            salud: {
                ...inscripcion.salud,
                [campo]: valor
            }
        });
    };

    return (
        <>
            <h2>Datos de salud</h2>

            <div className="grid">

                <div>
                    <label>Tipo de sangre</label>
                    <input
                        type="text"
                        value={inscripcion.salud.tipoSangre || ""}
                        onChange={(e) => actualizarSalud("tipoSangre", e.target.value)}
                    />
                </div>

                <div>
                    <label>Alergias</label>
                    <input
                        type="text"
                        value={inscripcion.salud.alergias || ""}
                        onChange={(e) => actualizarSalud("alergias", e.target.value)}
                    />
                </div>

                <div>
                    <label>Enfermedades o padecimientos</label>
                    <input
                        type="text"
                        value={inscripcion.salud.padecimientos || ""}
                        onChange={(e) => actualizarSalud("padecimientos", e.target.value)}
                    />
                </div>

                <div>
                    <label>¿Cuenta con servicio médico?</label>
                    <input
                        type="text"
                        value={inscripcion.salud.servicioMedico || ""}
                        onChange={(e) => actualizarSalud("servicioMedico", e.target.value)}
                    />
                </div>

                <div>
                    <label>Institución de salud</label>
                    <input
                        type="text"
                        value={inscripcion.salud.institucion || ""}
                        onChange={(e) => actualizarSalud("institucion", e.target.value)}
                    />
                </div>

                <div>
                    <label>Número de afiliación</label>
                    <input
                        type="text"
                        value={inscripcion.salud.numeroAfiliacion || ""}
                        onChange={(e) => actualizarSalud("numeroAfiliacion", e.target.value)}
                    />
                </div>

            </div>
        </>
    );
}

export default PasoSalud;