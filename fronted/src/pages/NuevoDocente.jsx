import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NuevoDocente() {
    const navigate = useNavigate();

    const [docente, setDocente] = useState({
        nombre: "",
        usuario: "",
        password: "123456",
        grupo_id: "",
        rol_id: 2
    });

    return (

        <div style={{ padding: "30px", maxWidth: "700px" }}>

            <h1>Nuevo Docente</h1>

            <br />

            <label>Nombre</label>

            <br />

            <input
                value={docente.nombre}
                onChange={(e) =>
                    setDocente({
                        ...docente,
                        nombre: e.target.value
                    })
                }
            />

            <br /><br />

            <label>Usuario</label>

            <br />

            <input
                value={docente.usuario}
                onChange={(e) =>
                    setDocente({
                        ...docente,
                        usuario: e.target.value
                    })
                }
            />

            <br /><br />

            <label>Grupo</label>

            <br />

            <select
                value={docente.grupo_id}
                onChange={(e) =>
                    setDocente({
                        ...docente,
                        grupo_id: e.target.value
                    })
                }
            >
                <option value="">Seleccione...</option>
                <option value="1">1°A</option>
                <option value="2">1°B</option>
                <option value="3">2°A</option>
                <option value="4">2°B</option>
                <option value="5">3°A</option>
                <option value="6">3°B</option>
            </select>

            <br /><br />

            <button
                onClick={async () => {

                    const respuesta = await fetch(
                        "https://sistemainscripcionesfridakahlo.onrender.com/docentes",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(docente)
                        }
                    );

                    const datos = await respuesta.json();

                    alert(datos.mensaje);
                    setDocente({
                        nombre: "",
                        usuario: "",
                        password: "123456",
                        grupo_id: "",
                        rol_id: 2
                    });

                    navigate("/dashboard/docentes");
                }}
            >
                Guardar docente
            </button>

        </div>

    );

}

export default NuevoDocente;