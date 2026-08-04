import React, { useEffect, useState } from "react";

export default function Promocao() {
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    fetch("https://jomabasto-backend.onrender.com/promocao")
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.log(err));
  }, []);

  if (!produto) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        A carregar promoção...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <img
        src={produto.images?.[0]}
        alt={produto.name}
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "12px",
        }}
      />

      <h1>{produto.name}</h1>

      <h2>{produto.price} €</h2>

      <p>
        Aproveita a nossa promoção especial JomaBasto.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 25px",
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Entrar na loja
      </a>
    </div>
  );
}