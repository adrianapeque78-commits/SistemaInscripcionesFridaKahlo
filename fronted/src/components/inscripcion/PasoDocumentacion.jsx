function PasoDocumentacion({ inscripcion, setInscripcion }) {

    const actualizarDocumentacion = (campo, valor) => {
        setInscripcion({
            ...inscripcion,
            documentacion: {
                ...inscripcion.documentacion,
                [campo]: valor
            }
        });
    };

    const esNuevoIngreso =
        inscripcion.alumno.tipo_inscripcion === "Nuevo ingreso";

    return (
        <>
            <h2>Documentación a presentar</h2>

            <p>
                El día de la inscripción deberá presentar la siguiente documentación para su cotejo y validación.
            </p>

            <div className="grid">

                <div>

                    <p>☐ Acta de nacimiento del alumno.</p>
                </div>

                <div>

                    <p>☐ CURP del alumno.</p>
                </div>
                {esNuevoIngreso && (
                    <div>

                        <p>☐ Hoja de asignación SEP (solo para alumnos de nuevo ingreso).</p>
                    </div>
                )}
                <div>

                    <p>☐ Identificación oficial vigente de la madre.</p>
                </div>

                <div>

                    <p>☐ Identificación oficial vigente del padre.</p>
                </div>

                <div>

                    <p>☐ Comprobante de domicilio reciente.</p>
                </div>


            </div>
            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#fff8e1",
                    border: "1px solid #f0c36d",
                    borderRadius: "8px"
                }}
            >
                <strong>Importante:</strong><br />
                La documentación será revisada físicamente el día de la inscripción.
                Presente original y copia de los documentos solicitados.
            </div>
        </>
    );
}

export default PasoDocumentacion;