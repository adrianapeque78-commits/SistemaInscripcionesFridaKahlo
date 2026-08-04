import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import FormularioInscripcion from "./pages/Inscripcion/FormularioInscripcion";
import Inscripciones from "./pages/Inscripciones";
import Preinscripciones from "./pages/Preinscripciones";
import Alumnos from "./pages/Alumnos";
import Docentes from "./pages/Docentes";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";
import ExpedienteAlumno from "./pages/ExpedienteAlumno";
import EditarInformacionFamiliar from "./pages/EditarInformacionFamiliar";
import NuevoDocente from "./pages/NuevoDocente";
import EditarDocente from "./pages/EditarDocente";
import CambiarPasswordDocente from "./pages/CambiarPasswordDocente";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route
        path="/inscripcion"
        element={<FormularioInscripcion />}
      />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="preinscripciones" element={<Preinscripciones />} />
        <Route path="formulario-inscripcion" element={<FormularioInscripcion />} />
        <Route path="alumnos" element={<Alumnos />} />
        <Route path="docentes" element={<Docentes />} />
        <Route path="docentes/nuevo" element={<NuevoDocente />} />
        <Route
          path="docentes/:id/password"
          element={<CambiarPasswordDocente />}
        />
        <Route
          path="docentes/:id/editar"
          element={<EditarDocente />}
        />
        <Route path="reportes" element={<Reportes />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="expediente/:id" element={<ExpedienteAlumno />} />
        <Route
          path="expediente/:id/documentacion"
          element={<EditarInformacionFamiliar />}
        />
      </Route>

    </Routes>
  );
}

export default App;