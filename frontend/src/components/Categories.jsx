export default function Categories({ onSelect }) {
  return (
    <section className="categories">
      <div className="categories-title">
        <h2>Encontra a sapatilha perfeita para ti</h2>

        <p>
          Escolhe a coleção que melhor se adapta ao teu estilo.
        </p>
      </div>

      <div className="categories-grid">
        <div className="category-card">
          <img
            src="/images/trail.png"
            alt="Trail"
          />

          <div className="category-content">
            <h3>Trail</h3>

            <p>
              Máxima aderência para qualquer terreno.
            </p>

            <button onClick={() => onSelect("trail")}>
              Ver coleção →
            </button>
          </div>
        </div>

        <div className="category-card">
          <img
            src="/images/running.png"
            alt="Running"
          />

          <div className="category-content">
            <h3>Running</h3>

            <p>
              Leveza e desempenho para cada quilómetro.
            </p>

            <button onClick={() => onSelect("running")}>
              Ver coleção →
            </button>
          </div>
        </div>

        <div className="category-card">
          <img
            src="/images/futsal.png"
            alt="Futsal"
          />

          <div className="category-content">
            <h3>Futsal</h3>

            <p>
              Controlo, agilidade e precisão em cada jogo.
            </p>

            <button onClick={() => onSelect("futsal")}>
              Ver coleção →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}