const API_URL = import.meta.env.VITE_API_URL;

export default API_URL;

export async function criarCliente(cliente) {
  const res = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cliente)
  });

  if (!res.ok) {
    throw new Error("Erro ao criar cliente");
  }

  return res.json();
}