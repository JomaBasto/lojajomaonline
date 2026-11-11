import { useEffect, useState } from "react";

import API_URL_CONFIG from "./api";

const API_URL = API_URL_CONFIG || "https://jomabasto-backend.onrender.com";

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

  async function saveShipping(event, orderId) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      estadoEnvio: formData.get("estadoEnvio"),
      transportadora: formData.get("transportadora"),
      codigoSeguimento: formData.get("codigoSeguimento"),
      linkSeguimento: formData.get("linkSeguimento"),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL + "/encomendas/" + orderId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Erro ao guardar a expedicao.");
      }

      alert("Dados de expedicao guardados.");
      await loadOrders();
    } catch (err) {
      alert(err.message || "Erro ao guardar a expedicao.");
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

            <hr />

            <h3>Gestão de expedição</h3>

            <form onSubmit={(event) => saveShipping(event, order._id)}>
              <label>
                Estado de expedição
                <select
                  name="estadoEnvio"
                  defaultValue={order.estadoEnvio || "Em preparação"}
                  style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }}
                >
                  <option value="Em preparação">Em preparação</option>
                  <option value="Enviada">Enviada</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </label>

              <label>
                Transportadora
                <input name="transportadora" defaultValue={order.transportadora || ""} placeholder="Ex.: CTT" style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }} />
              </label>

              <label>
                Código de seguimento
                <input name="codigoSeguimento" defaultValue={order.codigoSeguimento || ""} style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }} />
              </label>

              <label>
                Link de seguimento
                <input name="linkSeguimento" type="url" defaultValue={order.linkSeguimento || ""} placeholder="https://..." style={{ display: "block", width: "100%", padding: 8, margin: "6px 0 12px" }} />
              </label>

              <button type="submit" style={{ padding: "10px 18px", cursor: "pointer" }}>
                Guardar expedição
              </button>
            </form>

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