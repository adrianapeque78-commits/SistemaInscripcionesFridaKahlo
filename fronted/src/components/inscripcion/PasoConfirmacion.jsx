import { useState } from "react";

function PasoConfirmacion({ inscripcion }) {

    const [confirmado, setConfirmado] = useState(false);

    const guardarInscripcion = async () => {

        if (!confirmado) {
            alert("Debes confirmar la información antes de guardar.");
            return;
        }

        try {

            const respuesta = await fetch("https://sistemainscripcionesfridakahlo.onrender.com/inscripciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inscripcion)
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                console.error(datos);
                alert(datos.mensaje);
                return;
            }
        
            alert(
            `Su preinscripción fue registrada correctamente.

Folio: ${datos.folio}

Importante:

Guarde este folio y preséntelo el día de la inscripción.

Ese día deberá acudir con la documentación y copias solicitadas por el Jardín de Niños Frida Kahlo.`
        );

        setConfirmado(false);

        window.location.href = "/inscripcion";

    } catch (error) {

        console.error(error);

        alert("Ocurrió un error al guardar la inscripción.");

    }
};

return (
    <>
        <h2>Confirmación de la inscripción</h2>

        <p>
            Revisa que la información capturada sea correcta antes de guardar
            la inscripción del alumno.
        </p>

        <div>
            <label>
                <input
                    type="checkbox"
                    checked={confirmado}
                    onChange={(e) => setConfirmado(e.target.checked)}
                />
                Confirmo que la información proporcionada es correcta.
            </label>
        </div>

        <br />

        <button
            type="button"
            onClick={guardarInscripcion}
        >
            Guardar inscripción
        </button>
    </>
);
}

export default PasoConfirmacion;