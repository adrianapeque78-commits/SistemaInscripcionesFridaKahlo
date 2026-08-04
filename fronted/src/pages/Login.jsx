import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");

  const [password, setPassword] = useState("");
  const iniciarSesion = async () => {

    try {

      const respuesta = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          password
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        alert(datos.mensaje);
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(datos));
      console.log(datos);
      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      alert("No fue posible conectar con el servidor.");

    }

  };
  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/logo.png"
          alt="Logo Frida Kahlo"
          className="logo"
        />

        <h1 className="titulo">Jardín de Niños</h1>

        <h2 className="subtitulo">Frida Kahlo</h2>

        <p className="descripcion">
          Sistema Integral de Inscripciones
        </p>

        <input
          type="text"
          placeholder="Usuario"
          className="campo"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="campo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <button
          className="boton"
          onClick={iniciarSesion}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default Login;