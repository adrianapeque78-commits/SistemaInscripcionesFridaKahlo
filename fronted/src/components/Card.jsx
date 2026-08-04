import "../styles/Card.css";
function Card({ titulo, numero }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>

      <h1>{numero}</h1>
    </div>
  );
}

export default Card;