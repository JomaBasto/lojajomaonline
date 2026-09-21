const API_URL = "https://jomabasto-backend.onrender.com/produtos";

export async function carregarProdutos() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Servidor indisponível");
  }

  return await res.json();
}