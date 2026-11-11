import { useEffect, useState } from "react";

export default function Admin() {

  const [orders, setOrders] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [erroAvaliacoes, setErroAvaliacoes] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://jomabasto-backend.onrender.com";

  useEffect(() => {
    loadOrders();
    loadAvaliacoes();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch(`${API_URL}/encomendas`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function loadAvaliacoes() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/avaliacoes/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível carregar as avaliações.");
      }

      setAvaliacoes(Array.isArray(data.avaliacoes) ? data.avaliacoes : []);
      setErroAvaliacoes("");
    } catch (err) {
      setErroAvaliacoes(err.message);
    }
  }

  async function moderarAvaliacao(id, estado) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/avaliacoes/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível atualizar a avaliação.");
      }

      await loadAvaliacoes();
    } catch (err) {
      setErroAvaliacoes(err.message);
    }
  }
  async function changeStatus(id, estado) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/encomendas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      loadOrders();
    loadAvaliacoes();
    } catch (err) {
      console.log(err);
    }
  }

  const totalVendas = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "40px auto",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <h1>👑 Painel de Administração</h1>

      {/* GESTÃO DE PRODUTOS */}
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
      padding: 12,
      fontSize: 16,
      borderRadius: 8,
      cursor: "pointer",
    }}
  >
    + Adicionar Produto
  </button>
</div>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 25,
          marginBottom: 40,
        }}
      >
        <DashboardCard
          title="Encomendas"
          value={orders.length}
        />

        <DashboardCard
          title="Total Vendido"
          value={`${totalVendas.toFixed(2)} €`}
        />
      </div>

      <section style={{
        background: "#fff",
        padding: 25,
        marginBottom: 35,
        borderRadius: 12,
        boxShadow: "0 5px 20px rgba(0,0,0,.08)",
      }}>
        <h2>⭐ Moderação de Avaliações ({avaliacoes.filter(a => a.estado === "Pendente").length} pendentes)</h2>

        {erroAvaliacoes && (
          <p style={{ color: "#b91c1c" }}>{erroAvaliacoes}</p>
        )}

        {avaliacoes.filter(a => a.estado === "Pendente").length === 0 ? (
          <p>Não existem avaliações pendentes.</p>
        ) : avaliacoes.filter(a => a.estado === "Pendente").map(avaliacao => (
          <div key={avaliacao._id} style={{
            borderTop: "1px solid #eee",
            padding: "18px 0",
          }}>
            <p><strong>Produto:</strong> {avaliacao.produtoId}</p>
            <p><strong>Classificação:</strong> {"★".repeat(avaliacao.classificacao)} ({avaliacao.classificacao}/5)</p>
            <p><strong>Comentário:</strong> {avaliacao.comentario || "Sem comentário."}</p>
            <p><strong>Compra verificada:</strong> {avaliacao.compraVerificada ? "Sim" : "Não"}</p>
            <p><strong>Data:</strong> {avaliacao.createdAt ? new Date(avaliacao.createdAt).toLocaleString("pt-PT") : "-"}</p>
            <button
              onClick={() => moderarAvaliacao(avaliacao._id, "Aprovada")}
              style={{ padding: 10, marginRight: 10, cursor: "pointer" }}
            >
              Aprovar
            </button>
            <button
              onClick={() => moderarAvaliacao(avaliacao._id, "Rejeitada")}
              style={{ padding: 10, cursor: "pointer" }}
            >
              Rejeitar
            </button>
          </div>
        ))}
      </section>
      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "#fff",
            padding: 25,
            marginBottom: 30,
            borderRadius: 12,
            boxShadow: "0 5px 20px rgba(0,0,0,.08)",
          }}
        >
          <h2>
            📦 Encomenda #{order._id.slice(-6)}
          </h2>

          <hr />

          <h3>Cliente</h3>

          <p>
            <strong>Nome:</strong>{" "}
            {order.cliente?.nome || "-"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.cliente?.email || "-"}
          </p>

          <p>
            <strong>Telefone:</strong>{" "}
            {order.cliente?.telefone || "-"}
          </p>

          <p>
            <strong>Morada:</strong>{" "}
            {order.cliente?.morada || "-"}
          </p>

          <p>
            <strong>Código Postal:</strong>{" "}
            {order.cliente?.codigoPostal || "-"}
          </p>

          <p>
            <strong>Localidade:</strong>{" "}
            {order.cliente?.localidade || "-"}
          </p>

          <p>
            <strong>NIF:</strong>{" "}
            {order.cliente?.nif || "-"}
          </p>

          <hr />

          <h3>Produtos</h3>

          {order.items?.map((item, index) => (
            <div
              key={index}
              style={{
                padding: 10,
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

          <h2 style={{ marginTop: 20 }}>
            Total: {order.total.toFixed(2)} €
          </h2>

          <p>
            <strong>Estado:</strong>
          </p>

          <select
            value={order.estado || "Pendente"}
            onChange={(e) =>
              changeStatus(order._id, e.target.value)
            }
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <option>Pendente</option>
            <option>Pago</option>
            <option>Enviado</option>
            <option>Entregue</option>
            <option>Cancelado</option>
          </select>

          <p>
            <strong>Data:</strong>{" "}
            {new Date(
              order.createdAt
            ).toLocaleString("pt-PT")}
          </p>
        </div>
      ))}
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1d4ed8",
        color: "white",
        padding: 20,
        borderRadius: 10,
        minWidth: 220,
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}