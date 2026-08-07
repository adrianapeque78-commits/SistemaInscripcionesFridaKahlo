import { useEffect, useState } from "react";

function Listados() {

    const [grupo, setGrupo] = useState("");
    const [tipo, setTipo] = useState("oficial");
    const [grupos, setGrupos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [alumnos, setAlumnos] = useState([]);
    useEffect(() => {

        fetch("http://localhost:3001/listados/grupos")
            .then(res => res.json())
            .then(data => {
                setGrupos(data);
                setCargando(false);
            })
            .catch(error => {
                console.error(error);
                setCargando(false);
            });

    }, []);

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

                <label>Grupo</label>

                <select
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                >
                    <option value="">Seleccione...</option>
                    <option value="1">1° A</option>
                    <option value="2">1° B</option>
                    <option value="3">2° A</option>
                    <option value="4">2° B</option>
                    <option value="5">3° A</option>
                    <option value="6">3° B</option>
                </select>

                <br /><br />

                <button
                    onClick={async () => {

                        const respuesta = await fetch(
                            `http://localhost:3001/listados/grupo/${grupo}`
                        );

                        const datos = await respuesta.json();

                        setAlumnos(datos);

                    }}
                >
                    Generar listado
                </button>
                <br /><br />

                {alumnos.length > 0 && (

                    <table
                        border="1"
                        cellPadding="8"
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>
                                <th>Folio</th>
                                <th>Nombre</th>
                                <th>CURP</th>
                            </tr>

                        </thead>

                        <tbody>

                            {alumnos.map((alumno) => (

                                <tr key={alumno.id}>

                                    <td>{alumno.folio}</td>

                                    <td>
                                        {alumno.apellido_paterno}{" "}
                                        {alumno.apellido_materno}{" "}
                                        {alumno.nombre}
                                    </td>

                                    <td>{alumno.curp}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}
            </div>

        </div>

    );

}

export default Listados;