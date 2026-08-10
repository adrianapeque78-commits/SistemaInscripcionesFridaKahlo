import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import "../styles/Reportes.css";
import * as XLSX from "xlsx";

function Reportes() {

  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {

    const cargarAlumnos = async () => {

      try {

        const grupos = [1, 2, 3, 4, 5, 6];

        const respuestas = await Promise.all(
          grupos.map(id =>
            fetch(`https://sistema-inscripciones-frida-kahlo-b.vercel.app/listados/grupo/${id}`)
              .then(res => res.json())
          )
        );

        const todosLosAlumnos = respuestas.flat();

        setAlumnos(todosLosAlumnos);

        console.log("ALUMNOS PARA REPORTES:", todosLosAlumnos);

      } catch (error) {

        console.error("Error al cargar alumnos para reportes:", error);

      }

    };

    cargarAlumnos();

  }, []);

  const totalAlumnos = alumnos.length;

  const nuevoIngreso = alumnos.filter(
    alumno => alumno.tipo_inscripcion === "Nuevo ingreso"
  ).length;
  const alumnoDeLaCasa = alumnos.filter(
    alumno => alumno.tipo_inscripcion === "Alumno de la casa"
  ).length;
  const femenino = alumnos.filter(
    alumno => alumno.sexo === "Femenino"
  ).length;

  const masculino = alumnos.filter(
    alumno => alumno.sexo === "Masculino"
  ).length;
  const grupos = [
    "1° A",
    "1° B",
    "2° A",
    "2° B",
    "3° A",
    "3° B"
  ];

  const datosPorGrupo = grupos.map(grupo => {

    const alumnosGrupo = alumnos.filter(
      alumno => alumno.grupo === grupo
    );

    const femeninoGrupo = alumnosGrupo.filter(
      alumno => alumno.sexo === "Femenino"
    ).length;

    const masculinoGrupo = alumnosGrupo.filter(
      alumno => alumno.sexo === "Masculino"
    ).length;

    const documentacionPendiente = alumnos.filter(alumno =>
      !(
        alumno.acta &&
        alumno.doc_curp &&
        alumno.hoja_asignacion &&
        alumno.ine_madre &&
        alumno.ine_padre &&
        alumno.comprobante
      )
    ).length;
    return {
      grupo,
      femenino: femeninoGrupo,
      masculino: masculinoGrupo,
      total: alumnosGrupo.length
    };

  });

  const documentacionCompleta = alumnos.filter(alumno =>
    alumno.acta &&
    alumno.doc_curp &&
    alumno.hoja_asignacion &&
    alumno.ine_madre &&
    alumno.ine_padre &&
    alumno.comprobante
  ).length;

  const documentacionPendiente = alumnos.filter(alumno =>
    !(
      alumno.acta &&
      alumno.doc_curp &&
      alumno.hoja_asignacion &&
      alumno.ine_madre &&
      alumno.ine_padre &&
      alumno.comprobante
    )
  ).length;
  const madresRegistradas = alumnos.filter(
    alumno => alumno.madre_nombre
  ).length;

  const padresRegistrados = alumnos.filter(
    alumno => alumno.padre_nombre
  ).length;

  const contactosRegistrados = alumnos.filter(
    alumno => alumno.contactos && alumno.contactos.length > 0
  ).length;
  const exportarPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Jardín de Niños Frida Kahlo", 105, 20, {
      align: "center"
    });

    doc.setFontSize(13);
    doc.text("Reporte General", 105, 28, {
      align: "center"
    });

    // RESUMEN DE INSCRIPCIONES
    autoTable(doc, {
      startY: 38,
      head: [["RESUMEN DE INSCRIPCIONES", "TOTAL"]],
      body: [
        ["Total de alumnos", totalAlumnos],
        ["Nuevo ingreso", nuevoIngreso],
        ["Alumno de la casa", alumnoDeLaCasa]
      ]
    });

    // REPORTE POR SEXO
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["REPORTE POR SEXO", "TOTAL"]],
      body: [
        ["Femenino", femenino],
        ["Masculino", masculino]
      ]
    });

    // DISTRIBUCIÓN POR GRUPO
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["GRUPO", "FEMENINO", "MASCULINO", "TOTAL"]],
      body: datosPorGrupo.map(dato => [
        dato.grupo,
        dato.femenino,
        dato.masculino,
        dato.total
      ])
    });

    // DOCUMENTACIÓN
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["DOCUMENTACIÓN", "TOTAL"]],
      body: [
        ["Documentación completa", documentacionCompleta],
        ["Documentación pendiente", documentacionPendiente]
      ]
    });

    // TUTORES
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["TUTORES", "TOTAL"]],
      body: [
        ["Madres registradas", madresRegistradas],
        ["Padres registrados", padresRegistrados],
        ["Contactos de emergencia", contactosRegistrados]
      ]
    });

    // GRUPOS Y ESPACIOS
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["GRUPO", "ALUMNOS", "CAPACIDAD", "DISPONIBLES"]],
      body: datosPorGrupo.map(dato => {

        const capacidad = dato.grupo.startsWith("1°") ? 25 : 30;
        const disponibles = capacidad - dato.total;

        return [
          dato.grupo,
          dato.total,
          capacidad,
          disponibles
        ];

      })
    });

    doc.save("Reporte-General-Frida-Kahlo.pdf");
  };
  const exportarExcel = () => {

    const datos = datosPorGrupo.map(dato => {

      const capacidad = dato.grupo.startsWith("1°") ? 25 : 30;
      const disponibles = capacidad - dato.total;

      return {
        Grupo: dato.grupo,
        Femenino: dato.femenino,
        Masculino: dato.masculino,
        Total: dato.total,
        Capacidad: capacidad,
        Disponibles: disponibles
      };

    });

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      "Reporte de grupos"
    );

    XLSX.writeFile(
      libro,
      "Reporte-General-Frida-Kahlo.xlsx"
    );
  };
  return (
    <div className="reportes">

      <h1>Reportes</h1>

      <p className="subtitulo">
        Jardín de Niños Frida Kahlo
      </p>

      <div className="reportes-grid">

        {/* RESUMEN DE INSCRIPCIONES */}
        <div className="reporte-card">
          <h2>📊 Resumen de inscripciones</h2>

          <div className="reporte-datos">

            <div>
              <span>Total de alumnos</span>
              <strong>{totalAlumnos}</strong>
            </div>

            <div>
              <span>Nuevo ingreso</span>
              <strong>{nuevoIngreso}</strong>
            </div>

            <div>
              <span>Alumno de la casa</span>
              <strong>{alumnoDeLaCasa}</strong>
            </div>

          </div>
        </div>

        {/* REPORTE POR SEXO */}
        <div className="reporte-card">
          <h2>👧👦 Reporte por sexo</h2>

          <div className="reporte-datos">

            <div>
              <span>Femenino</span>
              <strong>{femenino}</strong>
            </div>

            <div>
              <span>Masculino</span>
              <strong>{masculino}</strong>
            </div>

          </div>

          <h3>Por grado y grupo</h3>

          <div className="tabla-reporte">

            <div className="fila encabezado">
              <span>Grupo</span>
              <span>Femenino</span>
              <span>Masculino</span>
              <span>Total</span>
            </div>

            {datosPorGrupo.map((dato) => (
              <div className="fila" key={dato.grupo}>
                <span>{dato.grupo}</span>
                <span>{dato.femenino}</span>
                <span>{dato.masculino}</span>
                <span>{dato.total}</span>
              </div>
            ))}

          </div>

        </div>
        {/* DOCUMENTACIÓN */}
        <div className="reporte-card">
          <h2>📋 Reporte de documentación</h2>

          <div className="reporte-datos">

            <div>
              <span>Documentación completa</span>
              <strong>{documentacionCompleta}</strong>
            </div>

            <div>
              <span>Documentación pendiente</span>
              <strong>{documentacionPendiente}</strong>
            </div>

          </div>
        </div>

        {/* TUTORES */}
        <div className="reporte-card">
          <h2>👨‍👩‍👧 Reporte de tutores</h2>

          <div className="reporte-datos">

            <div>
              <span>Madres registradas</span>
              <strong>{madresRegistradas}</strong>
            </div>

            <div>
              <span>Padres registrados</span>
              <strong>{padresRegistrados}</strong>
            </div>

            <div>
              <span>Contactos de emergencia</span>
              <strong>{contactosRegistrados}</strong>
            </div>

          </div>
        </div>

        {/* GRUPOS */}
        <div className="reporte-card reporte-card-grupos">
          <h2>🏫 Reporte de grupos</h2>

          <div className="tabla-reporte">

            <div className="fila encabezado">
              <span>Grupo</span>
              <span>Alumnos</span>
              <span>Capacidad</span>
              <span>Disponibles</span>
            </div>

            {datosPorGrupo.map((dato) => {

              const capacidad = dato.grupo.startsWith("1°") ? 25 : 30;
              const disponibles = capacidad - dato.total;

              return (
                <div className="fila" key={dato.grupo}>
                  <span>{dato.grupo}</span>
                  <span>{dato.total}</span>
                  <span>{capacidad}</span>
                  <span>{disponibles}</span>
                </div>
              );

            })}

          </div>
        </div>

        {/* EXPORTACIÓN */}
        <div className="reporte-card">
          <h2>📄 Exportación</h2>

          <div className="botones-reportes">

            <button onClick={exportarPDF}>
              Exportar PDF
            </button>

            <button onClick={exportarExcel}>
              Exportar Excel
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}

export default Reportes;