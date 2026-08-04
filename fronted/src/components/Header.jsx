import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div>
        <h1>Sistema Integral de Inscripciones</h1>
        <p>Jardín de Niños Frida Kahlo</p>
      </div>

      <div className="header-user">
        <div className="avatar">
          A
        </div>

        <div>
          <strong>Directora</strong>
          <p>Sesión iniciada</p>
        </div>
      </div>
    </header>
  );
}

export default Header;