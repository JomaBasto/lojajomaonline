import { useEffect, useState } from "react";

const API_URL = "https://jomabasto-backend.onrender.com";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/encomendas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const totalVendas = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div style={{ padding: 30 }}>
      <h1>📦 Gestão de Encomendas</h1>

      <h2>Total de vendas: {totalVendas.toFixed(2)} €</h2>

      {orders.length === 0 ? (
        <p>Não existem encomendas.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 20,
              marginTop: 20,
              background: "#fff",
            }}
          >
            <h2>Cliente</h2>

            <p><strong>Nome:</strong> {order.cliente?.nome}</p>
            <p><strong>Email:</strong> {order.cliente?.email}</p>
            <p><strong>Telefone:</strong> {order.cliente?.telefone}</p>

            <p>
              <strong>Morada:</strong>{" "}
              {order.cliente?.morada}
            </p>

            <p>
              <strong>Código Postal:</strong>{" "}
              {order.cliente?.codigoPostal}
            </p>

            <p>
              <strong>Localidade:</strong>{" "}
              {order.cliente?.localidade}
            </p>

            <p><strong>NIF:</strong> {order.cliente?.nif}</p>

            <p>
              <strong>Observações:</strong>{" "}
              {order.cliente?.observacoes || "-"}
            </p>

            <hr />

            <h3>Produtos</h3>

            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 10,
                  marginBottom: 10,
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{item.name}</strong>

                <br />

                Tamanho: {item.size}

                <br />

                Quantidade: {item.qty || 1}

                <br />

                Preço: {item.price.toFixed(2)} €
              </div>
            ))}

            <h3>Total: {order.total.toFixed(2)} €</h3>

            <p>
              <strong>Estado:</strong>{" "}
              {order.estado}
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("pt-PT")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}