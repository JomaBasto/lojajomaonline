import { useState } from "react";

export default function AdminProducts() {
  return (
    <div
      style={{
        background: "#fff",
        padding: 25,
        marginBottom: 40,
        borderRadius: 12,
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
      }}
    >
      <h2>📦 Gestão de Produtos</h2>

      <button
        style={{
          padding: "12px 20px",
          fontSize: 16,
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        + Adicionar Produto
      </button>
    </div>
  );
}