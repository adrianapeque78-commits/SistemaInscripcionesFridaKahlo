import Listados from "./pages/Listados";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";

import FormularioInscripcion from "./pages/Inscripcion/FormularioInscripcion";
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
import DashboardDocente from "./pages/DashboardDocente";
import DocumentacionDocente from "./pages/DocumentacionDocente";
import ExpedienteDocente from "./pages/ExpedienteDocente";
function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard-docente"
        element={<DashboardDocente />}
      />
      <Route
        path="/dashboard-docente/documentacion"
        element={<DocumentacionDocente />}
      />
      <Route
        path="/dashboard-docente/alumno/:id"
        element={<ExpedienteDocente />}
      />
      <Route
        path="/dashboard-docente/alumno/:id/editar"
        element={<EditarInformacionFamiliar />}
      />
      <Route
        path="/inscripcion"
        element={<FormularioInscripcion />}
      />

      <Route path="/dashboard" element={<Layout />}>

        <Route index element={<Home />} />

        <Route
          path="preinscripciones"
          element={<Preinscripciones />}
        />
        <Route
          path="listados"
          element={<Listados />}

        />
        <Route
          path="reportes"
          element={<Reportes />}
        />

        <Route
          path="alumnos"
          element={<Alumnos />}
        />

        <Route
          path="docentes"
          element={<Docentes />}
        />

        <Route
          path="docentes/nuevo"
          element={<NuevoDocente />}
        />

        <Route
          path="docentes/:id/editar"
          element={<EditarDocente />}
        />

        <Route
          path="docentes/:id/password"
          element={<CambiarPasswordDocente />}
        />

        <Route
          path="reportes"
          element={<Reportes />}
        />

        <Route
          path="configuracion"
          element={<Configuracion />}
        />

        <Route
          path="expediente/:id"
          element={<ExpedienteAlumno />}
        />

        <Route
          path="expediente/:id/documentacion"
          element={<EditarInformacionFamiliar />}
        />
        <Route
          path="expediente/:id/editar"
          element={<EditarInformacionFamiliar />}
        />
      </Route>

    </Routes>
  );
}

export default App;