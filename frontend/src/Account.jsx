import { useEffect, useState } from "react";
import API_URL from "./api";

export default function Account() {
  const [user, setUser] = useState(null);
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    async function carregarEncomendas() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setEncomendas(data);
      } catch (err) {
        console.error("Erro ao carregar encomendas:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarEncomendas();
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,.1)",
      }}
    >
      <h1>A Minha Conta</h1>

      <p>Bem-vindo à área de cliente da JomaBasto.</p>

      <hr style={{ margin: "30px 0" }} />

      <h3>Os meus dados</h3>

      <p>
        <strong>Nome:</strong> {user?.name || "-"}
      </p>

      <p>
        <strong>Email:</strong> {user?.email || "-"}
      </p>

      <hr style={{ margin: "30px 0" }} />

      <h3>As minhas encomendas</h3>

      {loading && <p>A carregar encomendas...</p>}

      {!loading && encomendas.length === 0 && (
        <p>Ainda não existem encomendas.</p>
      )}

      {encomendas.map((encomenda) => (
        <div
          key={encomenda._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>Estado:</strong> {encomenda.estado}
          </p>

          <p>
            <strong>Data:</strong>{" "}
            {new Date(encomenda.createdAt).toLocaleDateString("pt-PT")}
          </p>

          {encomenda.items.map((item, index) => (
            <div key={index}>
              {item.name} - Tamanho: {item.size} - Qtd: {item.qty}
            </div>
          ))}

          <p>
            <strong>Total:</strong> {encomenda.total.toFixed(2)} €
          </p>
        </div>
      ))}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
        }}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Terminar sessão
      </button>
    </div>
  );
}