export default function Categories({ onSelect }) {
  const categories = [
    {
      id: "running",
      name: "Running",
      desktop: "/images/running-novo.jpg",
      mobile: "/images/running-novo.jpg",
    },
    {
      id: "trail",
      name: "Trail",
      desktop: "/images/trail-novo.jpg",
      mobile: "/images/trail-novo.jpg",
    },
    {
      id: "futsal",
      name: "Futsal",
      desktop: "/images/futsal-novo.jpg",
      mobile: "/images/futsal-novo.jpg",
    },
    {
      id: "tenis",
      name: "Ténis",
      desktop: "/images/tenis-novo.jpg",
      mobile: "/images/tenis-novo.jpg",
    },
  ];

  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-poster ${category.id === "promocoes" ? "category-poster-promocoes" : ""}`}
            onClick={() => onSelect(category.id)}
          >
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet={category.mobile}
              />

              <img
                src={category.desktop}
                alt={`Joma ${category.name}`}
              />
            </picture>
          </button>
        ))}
      </div>
    </section>
  );
}


