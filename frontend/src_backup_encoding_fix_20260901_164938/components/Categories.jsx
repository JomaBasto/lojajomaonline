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
      id: "basquetebol",
      name: "Basquetebol",
      desktop: "/images/basquetebol-desktop.jpg",
      mobile: "/images/basquetebol-mobile.jpg",
    },
    {
      id: "tenis",
      name: "Ténis",
      desktop: "/images/tenis-desktop.jpg",
      mobile: "/images/tenis-mobile.jpg",
    },
    {
      id: "padel",
      name: "Padel",
      desktop: "/images/padel-desktop.jpg",
      mobile: "/images/padel-mobile.jpg",
    },
    {
      id: "voleibol",
      name: "Voleibol",
      desktop: "/images/voleibol-desktop.jpg",
      mobile: "/images/voleibol-mobile.jpg",
    },
    {
      id: "ciclismo",
      name: "Ciclismo",
      desktop: "/images/ciclismo-desktop.jpg",
      mobile: "/images/ciclismo-mobile.jpg",
    },
    {
      id: "casual-textil",
      name: "Casual",
      desktop: "/images/casual-desktop.jpg",
      mobile: "/images/casual-mobile.jpg",
    },
    {
      id: "promocoes",
      name: "Ofertas da Semana",
      desktop: "/images/ofertas da semana-desktop.jpg",
      mobile: "/images/ofertas da semana-mobile.jpg",
    },
    {
      id: "outlet",
      name: "Outlet",
      desktop: "/images/outlet-desktop.jpg",
      mobile: "/images/outlet-mobile.jpg",
    },
    {
      id: "acessorios",
      name: "Acessórios",
      desktop: "/images/acessorios-desktop.jpg",
      mobile: "/images/acessorios-mobile.jpg",
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





