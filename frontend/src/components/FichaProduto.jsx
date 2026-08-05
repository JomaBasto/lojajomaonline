import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FichaProduto() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    fetch("https://jomabasto-backend.onrender.com/produtos")
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find(
          (p) => p._id === id
        );

        setProduto(encontrado);
      })
      .catch((err) =>
        console.error("Erro ao carregar produto:", err)
      );
  }, [id]);

  if (!produto) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        A carregar produto...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        <img
          src={produto.images?.[0]}
          alt={produto.name}
          style={{
            width: "450px",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />

        <div style={{ flex: 1 }}>
          <h1>{produto.name}</h1>

          {produto.promocao && produto.promoPrice ? (
            <>
              <p
                style={{
                  textDecoration: "line-through",
                  color: "#888",
                  fontSize: "18px",
                }}
              >
                {produto.price.toFixed(2).replace(".", ",")} €
              </p>

              <h2 style={{ color: "#d32f2f" }}>
                {produto.promoPrice.toFixed(2).replace(".", ",")} €
              </h2>
            </>
          ) : (
            <h2 style={{ color: "#d32f2f" }}>
              {produto.price.toFixed(2).replace(".", ",")} €
            </h2>
          )}

          <p>
            <strong>Tamanhos disponíveis:</strong>
          </p>

          <p>
            {produto.sizes?.join(" | ")}
          </p>

          <p
            style={{
              whiteSpace: "pre-line",
              lineHeight: "1.6",
            }}
          >
            {produto.description}
          </p>
        </div>
      </div>
    </div>
  );
}
