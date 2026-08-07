import { useState } from "react";

function Listados() {

    const [grado, setGrado] = useState("");
    const [grupo, setGrupo] = useState("");
    const [tipo, setTipo] = useState("oficial");

    return (

        <div style={{ padding: "30px" }}>

            <h1>📋 Centro de Listados</h1>

            <hr />

            <div
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
                    maxWidth: "700px"
                }}
            >

                <h2>Generar listado</h2>

                <br />

                <label>Tipo de listado</label>

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="oficial">Relación Oficial SEP</option>
                    <option value="asistencia">Lista de asistencia</option>
                    <option value="padron">Padrón general</option>
                    <option value="directorio">Directorio de padres</option>
                    <option value="documentacion">Documentación pendiente</option>
                </select>

                <br /><br />

                <label>Grado</label>

                <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                >
                    <option value="">Seleccione...</option>
                    <option value="1">Primero</option>
                    <option value="2">Segundo</option>
                    <option value="3">Tercero</option>
                </select>

                <br /><br />

                <label>Grupo</label>

                <select
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                >
                    <option value="">Seleccione...</option>
                    <option>A</option>
                    <option>B</option>
                </select>

                <br /><br />

                <button>
                    Generar listado
                </button>

            </div>

        </div>

    );

}

export default Listados;