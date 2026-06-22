export async function criarCliente(cliente) {
  const res = await fetch("/clientes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar cliente");
  }

  return res.json();
}