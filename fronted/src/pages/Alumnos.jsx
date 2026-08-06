import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function Alumnos() {
  return (
    <div style={{ padding: "30px" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}
      >
        <div>
          <h1>Alumnos</h1>
          <p>Alumnos inscritos oficialmente en el ciclo escolar.</p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Nuevo alumno
        </Button>

      </div>

      <p>Aquí aparecerá la lista de alumnos.</p>

    </div>
  );
}

export default Alumnos;