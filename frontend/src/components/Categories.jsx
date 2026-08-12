export default function Categories({ onSelect }) {
  const categories = [
    {
      id: "running",
      name: "Running",
      desktop: "/images/running-desktop.jpg",
      mobile: "/images/running-mobile.jpg",
    },
    {
      id: "trail",
      name: "Trail",
      desktop: "/images/trail-desktop.jpg",
      mobile: "/images/trail-mobile.jpg",
    },
    {
      id: "futebol",
      name: "Futebol",
      desktop: "/images/futebol-desktop.jpg",
      mobile: "/images/futebol-mobile.jpg",
    },
    {
      id: "futsal",
      name: "Futsal",
      desktop: "/images/futsal-desktop.jpg",
      mobile: "/images/futsal-mobile.jpg",
    },
    {
      id: "andebol",
      name: "Andebol",
      desktop: "/images/andebol-desktop.jpg",
      mobile: "/images/andebol-mobile.jpg",
    },
    {
      id: "casual",
      name: "Casual",
      desktop: "/images/casual-desktop.jpg",
      mobile: "/images/casual-mobile.jpg",
    },
    {
      id: "promocoes",
      name: "Ofertas da Semana",
      desktop: "/images/ofertas-desktop.jpg",
      mobile: "/images/ofertas-mobile.jpg",
    },
    {
      id: "outlet",
      name: "Outlet",
      desktop: "/images/outlet-desktop.jpg",
      mobile: "/images/outlet-mobile.jpg",
    },
  ];

  return (
  <section className="categories-section">
    <div className="categories-grid">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="category-poster"
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


