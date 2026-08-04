import Card from "../components/Card";
import "../styles/Dashboard.css";

function Home() {

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario.rol_id === 2) {

    return (

      <main className="contenido">

        <div className="dashboard-header">

          <h1 className="titulo-dashboard">
            Bienvenida {usuario.nombre}
          </h1>

          <p className="subtitulo-dashboard">
            Grupo asignado
          </p>

          <h2>{usuario.grupo_id}</h2>

        </div>

      </main>

    );

  }

  return (

    <main className="contenido">

      <div className="dashboard-header">

        <h1 className="titulo-dashboard">
          Sistema Integral de Inscripciones
        </h1>

        <p className="subtitulo-dashboard">
          Jardín de Niños Frida Kahlo
        </p>

      </div>

      <div className="cards">

        <Card titulo="Alumnos" numero="162" />

        <Card titulo="Docentes" numero="5" />

        <Card titulo="Grupos" numero="6" />

        <Card titulo="Folios" numero="48" />

      </div>

    </main>

  );

}

export default Home;