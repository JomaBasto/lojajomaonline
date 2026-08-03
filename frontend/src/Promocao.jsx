import React from "react";
import promocaoImagem from "./assets/promocao-tundra.jpg";

export default function Promocao() {
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
        src={promocaoImagem}
        alt="Promoção JomaBasto"
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "12px",
        }}
      />

      <h1>Promoção Especial JomaBasto</h1>

      <p>
        Aproveita a nossa oferta atual.
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