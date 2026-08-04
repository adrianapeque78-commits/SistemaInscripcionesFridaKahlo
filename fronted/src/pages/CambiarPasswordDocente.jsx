import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CambiarPasswordDocente() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    return (

        <div style={{ padding: "30px", maxWidth: "500px" }}>

            <h1>Cambiar contraseña</h1>

            <br />

            <label>Nueva contraseña</label>

            <br />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button
                onClick={async () => {

                    const respuesta = await fetch(
                        `http://localhost:3001/docentes/${id}/password`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ password })
                        }
                    );

                    const datos = await respuesta.json();

                    alert(datos.mensaje);

                    navigate("/dashboard/docentes");

                }}
            >
                Cambiar contraseña
            </button>

        </div>

    );

}

export default CambiarPasswordDocente;