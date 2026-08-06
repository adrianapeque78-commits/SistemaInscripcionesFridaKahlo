import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditarDocente() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [docente, setDocente] = useState({
        nombre: "",
        usuario: "",
        grupo_id: ""
    });

    useEffect(() => {

        fetch(`https://sistemainscripcionesfridakahlo.onrender.com/docentes/${id}`)
            .then(res => res.json())
            .then(data => setDocente(data))
            .catch(console.error);

    }, [id]);

    return (

        <div style={{ padding: "30px", maxWidth: "700px" }}>

            <h1>Editar Docente</h1>

            <br />

            <label>Nombre</label>

            <br />

            <input
                value={docente.nombre ?? ""}
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
                value={docente.usuario ?? ""}
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
                value={docente.grupo_id ?? ""}
                onChange={(e) =>
                    setDocente({
                        ...docente,
                        grupo_id: e.target.value
                    })
                }
            >
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
                        `https://sistemainscripcionesfridakahlo.onrender.com/docentes/${id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(docente)
                        }
                    );

                    const datos = await respuesta.json();

                    alert(datos.mensaje);

                    navigate("/dashboard/docentes");

                }}
            >
                Guardar cambios
            </button>

        </div>

    );

}

export default EditarDocente;