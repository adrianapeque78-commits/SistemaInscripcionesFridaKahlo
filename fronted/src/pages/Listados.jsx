import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function Listados() {

    const [grupo, setGrupo] = useState("");
    const [tipo, setTipo] = useState("oficial");
    const [grupos, setGrupos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [alumnos, setAlumnos] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
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
    const generarPDF = (listaAlumnos) => {
        if (tipo === "directorio") {

            if (!alumnoSeleccionado) {
                alert("Seleccione un alumno.");
                return;
            }

            const doc = new jsPDF(); 

            const alumno = listaAlumnos.find(
                a => String(a.id) === String(alumnoSeleccionado.id)
            );
            const contactos = alumno.contactos || [];
            console.log("CONTACTOS DEL DIRECTORIO:", alumno.contactos);
            console.log("ALUMNO COMPLETO DIRECTORIO:", alumno);
            doc.setFontSize(16);
            doc.text("Jardín de Niños Frida Kahlo", 105, 20, {
                align: "center"
            });

            doc.setFontSize(13);
            doc.text("Directorio de Padres", 105, 28, {
                align: "center"
            });

            doc.setFontSize(12);
            doc.text(
                `${alumno.apellido_paterno || ""} ${alumno.apellido_materno || ""}, ${alumno.nombre || ""}`,
                105,
                36,
                { align: "center" }
            );

            autoTable(doc, {
                startY: 45,

                head: [["DATOS DEL ALUMNO", "INFORMACIÓN"]],

                body: [
                    ["Folio", alumno.folio || ""],
                    ["Grupo", alumno.grupo || ""],
                    [
                        "Domicilio",
                        `${alumno.calle || ""} ${alumno.numero || ""}, ${alumno.colonia || ""}, ${alumno.municipio || ""}`
                    ]
                ]
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,

                head: [["MADRE", "TELÉFONO", "CORREO"]],

                body: [[
                    alumno.madre_nombre || "",
                    alumno.madre_telefono || "",
                    alumno.madre_correo || ""
                ]]
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,

                head: [["PADRE", "TELÉFONO", "CORREO"]],

                body: [[
                    alumno.padre_nombre || "",
                    alumno.padre_telefono || "",
                    alumno.padre_correo || ""
                ]]
            });

            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 8,

                head: [["CONTACTO DE EMERGENCIA", "PARENTESCO", "TELÉFONO"]],

                body: contactos.map(contacto => [
                    contacto.nombre || "",
                    contacto.parentesco || "",
                    contacto.telefono || ""
                ])
            });

            doc.save(
                `Directorio-${alumno.apellido_paterno || ""}-${alumno.nombre || ""}.pdf`
            );

            return;
        }
        if (tipo === "documentacion") {

            const doc = new jsPDF("landscape", "mm", "a3");

            const nombreGrupo =
                grupos.find(g => String(g.id) === String(grupo))?.nombre || "";

            doc.setFontSize(16);
            doc.text("Jardín de Niños Frida Kahlo", 105, 20, {
                align: "center"
            });

            doc.setFontSize(13);
            doc.text(`Documentación Pendiente - ${nombreGrupo}`, 105, 28, {
                align: "center"
            });

            autoTable(doc, {

                startY: 38,

                head: [[
                    "No.",
                    "Folio",
                    "Alumno",
                    "Acta",
                    "CURP",
                    "Hoja asignación",
                    "INE madre",
                    "INE padre",
                    "Comprobante"
                ]],

                body: listaAlumnos.map((alumno, index) => [

                    index + 1,

                    alumno.folio || "",

                    `${alumno.apellido_paterno || ""} ${alumno.apellido_materno || ""}, ${alumno.nombre || ""}`,

                    alumno.acta ? "ENTREGADO" : "PENDIENTE",

                    alumno.doc_curp ? "ENTREGADO" : "PENDIENTE",

                    alumno.hoja_asignacion ? "ENTREGADO" : "PENDIENTE",

                    alumno.ine_madre ? "ENTREGADO" : "PENDIENTE",

                    alumno.ine_padre ? "ENTREGADO" : "PENDIENTE",

                    alumno.comprobante ? "ENTREGADO" : "PENDIENTE"

                ]),

                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    overflow: "linebreak",
                    valign: "middle"
                },

                headStyles: {
                    fontSize: 7,
                    halign: "center"
                },

                columnStyles: {
                    0: { cellWidth: 12 },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 65 },
                    3: { cellWidth: 40 },
                    4: { cellWidth: 40 },
                    5: { cellWidth: 50 },
                    6: { cellWidth: 45 },
                    7: { cellWidth: 45 },
                    8: { cellWidth: 50 }
                }

            });

            doc.save(`Documentacion-Pendiente-${nombreGrupo}.pdf`);

            return;
        }
        if (tipo === "padron") {

            const doc = new jsPDF("landscape", "mm", "a2");

            const nombreGrupo =
                grupos.find(g => String(g.id) === String(grupo))?.nombre || "";

            doc.setFontSize(16);
            doc.text("Jardín de Niños Frida Kahlo", 148, 15, {
                align: "center"
            });

            doc.setFontSize(13);
            doc.text(`Padrón General - ${nombreGrupo}`, 148, 23, {
                align: "center"
            });

            autoTable(doc, {
                startY: 30,

                head: [[
                    "No.",
                    "Folio",
                    "Alumno",
                    "CURP",
                    "Fecha de nacimiento",
                    "Sexo",
                    "Domicilio",
                    "C.P.",
                    "Municipio",
                    "Madre",
                    "CURP madre",
                    "Tel. madre",
                    "Correo madre",
                    "Padre",
                    "CURP padre",
                    "Tel. padre",
                    "Correo padre",
                    "Tipo sangre",
                    "Alergias",
                    "Padecimientos",
                    "Servicio médico",
                    "Institución",
                    "Afiliación",
                    "Emergencia 1",
                    "Tel. emergencia 1",
                    "Emergencia 2",
                    "Tel. emergencia 2",
                    "Emergencia 3",
                    "Tel. emergencia 3"
                ]],

                body: listaAlumnos.map((alumno, index) => {

                    const contactos = alumno.contactos || [];

                    return [
                        index + 1,
                        alumno.folio || "",

                        `${alumno.apellido_paterno || ""} ${alumno.apellido_materno || ""}, ${alumno.nombre || ""}`,

                        alumno.curp || "",

                        alumno.fecha_nacimiento
                            ? new Date(alumno.fecha_nacimiento)
                                .toLocaleDateString("es-MX")
                            : "",

                        alumno.sexo || "",

                        `${alumno.calle || ""} ${alumno.numero || ""}, ${alumno.colonia || ""}`,

                        alumno.codigo_postal || "",

                        alumno.municipio || "",

                        alumno.madre_nombre || "",
                        alumno.madre_curp || "",
                        alumno.madre_telefono || "",
                        alumno.madre_correo || "",

                        alumno.padre_nombre || "",
                        alumno.padre_curp || "",
                        alumno.padre_telefono || "",
                        alumno.padre_correo || "",

                        alumno.tipo_sangre || "",
                        alumno.alergias || "",
                        alumno.padecimientos || "",
                        alumno.servicio_medico || "",
                        alumno.institucion || "",
                        alumno.numero_afiliacion || "",

                        contactos[0]?.nombre || "",
                        contactos[0]?.telefono || "",

                        contactos[1]?.nombre || "",
                        contactos[1]?.telefono || "",

                        contactos[2]?.nombre || "",
                        contactos[2]?.telefono || ""
                    ];

                }),

                styles: {
                    fontSize: 5,
                    cellPadding: 2,
                    overflow: "linebreak",
                    valign: "middle"
                },

                headStyles: {
                    fontSize: 5,
                    halign: "center"
                },

                columnStyles: {
                    0: { cellWidth: 8 },
                    1: { cellWidth: 15 },
                    2: { cellWidth: 28 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 17 },
                    5: { cellWidth: 10 },
                    6: { cellWidth: 30 },
                    7: { cellWidth: 12 },
                    8: { cellWidth: 18 },
                    9: { cellWidth: 25 },
                    10: { cellWidth: 25 },
                    11: { cellWidth: 18 },
                    12: { cellWidth: 28 },
                    13: { cellWidth: 25 },
                    14: { cellWidth: 25 },
                    15: { cellWidth: 18 },
                    16: { cellWidth: 28 },
                    17: { cellWidth: 12 },
                    18: { cellWidth: 20 },
                    19: { cellWidth: 25 },
                    20: { cellWidth: 20 },
                    21: { cellWidth: 20 },
                    22: { cellWidth: 20 },
                    23: { cellWidth: 25 },
                    24: { cellWidth: 18 },
                    25: { cellWidth: 25 },
                    26: { cellWidth: 18 },
                    27: { cellWidth: 25 },
                    28: { cellWidth: 18 }
                },

                didDrawPage: function () {

                    doc.setFontSize(8);

                    doc.text(
                        `Grupo: ${nombreGrupo}`,
                        14,
                        202
                    );

                }
            });

            doc.save(`Padron-General-${nombreGrupo}.pdf`);

            return;
        }
        const doc = new jsPDF();

        const nombreGrupo =
            grupos.find(g => String(g.id) === String(grupo))?.nombre || "";

        let titulo = "";

        if (tipo === "oficial") titulo = "Relación Oficial SEP";
        if (tipo === "asistencia") titulo = "Lista de Asistencia";
        if (tipo === "padron") titulo = "Padrón General";
        if (tipo === "directorio") titulo = "Directorio de Padres";
        if (tipo === "documentacion") titulo = "Documentación Pendiente";

        doc.setFontSize(16);
        doc.text("Jardín de Niños Frida Kahlo", 105, 20, {
            align: "center"
        });

        doc.setFontSize(13);
        doc.text(`${titulo} - ${nombreGrupo}`, 105, 30, {
            align: "center"
        });
        if (tipo === "asistencia") {

            autoTable(doc, {
                startY: 40,
                head: [[
                    "No.",
                    "Alumno",
                    "L",
                    "M",
                    "M",
                    "J",
                    "V"
                ]],
                body: listaAlumnos.map((alumno, index) => [
                    index + 1,
                    `${alumno.apellido_paterno} ${alumno.apellido_materno}, ${alumno.nombre}`,
                    "",
                    "",
                    "",
                    "",
                    ""
                ])
            });

            doc.save(`Lista de Asistencia-${nombreGrupo}.pdf`);

            return;
        }
        autoTable(doc, {
            startY: 40,
            head: [[
                "No.",
                "Folio",
                "Nombre",
                "CURP",
                "Sexo",
                "Fecha de nacimiento"
            ]],
            body: listaAlumnos.map((alumno, index) => [
                index + 1,
                alumno.folio,
                `${alumno.apellido_paterno} ${alumno.apellido_materno}, ${alumno.nombre}`,
                alumno.curp,
                alumno.sexo,
                new Date(alumno.fecha_nacimiento)
                    .toLocaleDateString("es-MX")
            ])
        });

        doc.save(`${titulo}-${nombreGrupo}.pdf`);
    };
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
                {tipo === "directorio" && alumnos.length > 0 && (
                    <>
                        <br /><br />

                        <label>Alumno</label>

                        <select
                            value={alumnoSeleccionado?.id || ""}
                            onChange={(e) => {
                                const seleccionado = alumnos.find(
                                    alumno => String(alumno.id) === String(e.target.value)
                                );

                                setAlumnoSeleccionado(seleccionado);
                            }}
                        >
                            <option value="">Seleccione un alumno...</option>

                            {alumnos.map((alumno) => (
                                <option
                                    key={alumno.id}
                                    value={alumno.id}
                                >
                                    {alumno.apellido_paterno} {alumno.apellido_materno}, {alumno.nombre}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                <br /><br />

                <button
                    onClick={async () => {

                        const respuesta = await fetch(
                            `http://localhost:3001/listados/grupo/${grupo}`
                        );

                        const datos = await respuesta.json();

                        setAlumnos(datos);
                        console.log("Datos completos del grupo:", datos);
                        generarPDF(datos);

                    }}
                >
                    Generar listado
                </button>
                <br /><br />

                {alumnos.length > 0 && (
                    <>
                        <h3 style={{ marginTop: "30px" }}>
                            {tipo === "oficial" && "Relación Oficial SEP"}
                            {tipo === "asistencia" && "Lista de Asistencia"}
                            {tipo === "padron" && "Padrón General"}
                            {tipo === "directorio" && "Directorio de Padres"}
                            {tipo === "documentacion" && "Documentación Pendiente"}
                            {" - "}
                            {
                                grupos.find(g => String(g.id) === String(grupo))?.nombre
                            }
                        </h3>

                        <table
                            id="tablaListado"
                            border="1"
                            cellPadding="8"
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr>
                                    <th>No.</th>
                                    <th>Folio</th>
                                    <th>Nombre</th>
                                    <th>CURP</th>
                                    <th>Sexo</th>
                                    <th>Fecha de nacimiento</th>
                                </tr>

                            </thead>

                            <tbody>

                                {alumnos.map((alumno, index) => (

                                    <tr key={alumno.id}>
                                        <td>{index + 1}</td>
                                        <td>{alumno.folio}</td>

                                        <td>
                                            {`${alumno.apellido_paterno} ${alumno.apellido_materno}, ${alumno.nombre}`}
                                        </td>

                                        <td>{alumno.curp}</td>
                                        <td>{alumno.sexo}</td>
                                        <td>
                                            {new Date(alumno.fecha_nacimiento).toLocaleDateString("es-MX")}
                                        </td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </>

                )}
            </div>

        </div>

    );

}

export default Listados;