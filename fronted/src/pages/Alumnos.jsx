import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Alumnos() {

  const [alumnos, setAlumnos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://sistemainscripcionesfridakahlo.onrender.com/inscripciones/alumnos")
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "30px" }}>

      <h1>Alumnos</h1>

      <p>Alumnos inscritos oficialmente.</p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}
      >
        <thead>
          <tr>
            <th>Folio</th>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {alumnos.map((alumno) => (

            <tr key={alumno.id}>
              <td>{alumno.folio}</td>
              <td>{alumno.nombre}</td>
              <td>{alumno.grupo}</td>
              <td>
                <button
                  onClick={() => navigate(`/dashboard/expediente/${alumno.id}`)}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "transparent"
                  }}
                >
                  <VisibilityIcon color="primary" />
                </button>
              </td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

}

export default Alumnos;