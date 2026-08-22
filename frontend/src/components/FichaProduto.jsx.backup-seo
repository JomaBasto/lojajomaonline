import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FichaProduto() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    fetch("https://jomabasto-backend.onrender.com/produtos")
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find((p) => p._id === id);
        setProduto(encontrado);
      })
      .catch((err) =>
        console.error("Erro ao carregar produto:", err)
      );
  }, [id]);

  const comprarAgora = () => {
    if (!selectedSize) {
      alert("Escolhe um tamanho primeiro");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const preco =
      produto.promoPrice != null
        ? Number(produto.promoPrice)
        : Number(produto.price);

    const existing = cart.find(
      (item) =>
        item._id === produto._id &&
        item.size === selectedSize
    );

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item._id === produto._id &&
        item.size === selectedSize
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...produto,
          price: preco,
          size: selectedSize,
          qty: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.location.href = "/checkout";
  };

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
          alignItems: "flex-start",
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

        <div style={{ flex: 1, minWidth: "280px" }}>
          <h1>{produto.name}</h1>

          {produto.promocao && produto.promoPrice ? (
            <>
              <p
                style={{
                  textDecoration: "line-through",
                  color: "#888",
                  fontSize: "18px",
                  marginBottom: "5px",
                }}
              >
                {Number(produto.price).toFixed(2).replace(".", ",")} €
              </p>

              <h2 style={{ color: "#d32f2f", marginTop: 0 }}>
                {Number(produto.promoPrice).toFixed(2).replace(".", ",")} €
              </h2>
            </>
          ) : (
            <h2 style={{ color: "#d32f2f" }}>
              {Number(produto.price).toFixed(2).replace(".", ",")} €
            </h2>
          )}

          <p>
            <strong>Tamanhos disponíveis:</strong>
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "25px",
            }}
          >
            {produto.sizes?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border:
                    selectedSize === size
                      ? "2px solid #1d4ed8"
                      : "1px solid #ccc",
                  background:
                    selectedSize === size ? "#1d4ed8" : "#fff",
                  color:
                    selectedSize === size ? "#fff" : "#111",
                  cursor: "pointer",
                  fontWeight:
                    selectedSize === size ? "600" : "400",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            onClick={comprarAgora}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "14px 25px",
              border: "none",
              borderRadius: "7px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "17px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "25px",
            }}
          >
            Comprar Agora
          </button>

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
