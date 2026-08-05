import React, { useEffect, useState } from "react";

export default function Promocao() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("https://jomabasto-backend.onrender.com/promocao")
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.log(err));
  }, []);

  if (produtos.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        A carregar ofertas...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>OFERTAS DA SEMANA</h1>

      <p style={{ marginBottom: "40px", color: "#666" }}>
        Descubra as promoções selecionadas desta semana.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "25px",
        }}
      >
        {produtos.map((produto) => (
          <div
            key={produto._id}
            style={{
              width: "320px",
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,.10)",
            }}
          >
            <img
              src={produto.images?.[0]}
              alt={produto.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "contain",
              }}
            />

            <h3>{produto.name}</h3>

            <h2 style={{ color: "#d32f2f" }}>
              {produto.price} €
            </h2>

            <p
  style={{
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "15px",
    textAlign: "left",
  }}
>
  {produto.description}
</p>

<p style={{ marginTop: "15px" }}>
  <strong>Tamanhos:</strong>{" "}
  {produto.sizes?.join(", ")}
</p>

            <a
              href="/"
              style={{
                display: "inline-block",
                marginTop: "15px",
                padding: "12px 24px",
                background: "#1d4ed8",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "30px",
                fontWeight: "bold",
              }}
            >
              Ver produto
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}