function PasoDocumentacion({ inscripcion }) {

    const esNuevoIngreso =
        inscripcion.alumno.tipo_inscripcion === "Nuevo ingreso";

    const grado = Number(inscripcion.alumno.grado_solicitado || 0);

    const requiereEvaluacion =
        grado === 2 || grado === 3;

    return (
        <>
            <h2>Documentación a presentar</h2>

            <p>
                El día de la inscripción deberá presentar la siguiente
                documentación para su cotejo y validación.
            </p>

            <div className="grid">

                <div>
                    <p>☐ Acta de nacimiento original.</p>
                </div>

                <div>
                    <p>☐ CURP del alumno actualizado.</p>
                </div>

                {esNuevoIngreso && (
                    <div>
                        <p>
                            ☐ Hoja de asignación SEP.
                        </p>
                    </div>
                )}

                <div>
                    <p>☐ CURP del tutor actualizado.</p>
                </div>

                <div>
                    <p>☐ INE del tutor.</p>
                </div>

                {requiereEvaluacion && (
                    <div>
                        <p>
                            ☐ Reporte de evaluaciones según sea el caso
                            (solo para quienes ingresan a 2° y 3°).
                        </p>
                    </div>
                )}

                <div>
                    <p>☐ Comprobante domiciliario.</p>
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
                La documentación será revisada físicamente el día de la
                inscripción. Presente original y copia de los documentos
                solicitados.
            </div>
        </>
    );
}

export default PasoDocumentacion;