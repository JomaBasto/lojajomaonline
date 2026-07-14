import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [morada, setMorada] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [nif, setNif] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const API_URL = "https://jomabasto-backend.onrender.com";

  const pay = async () => {
    try {
      if (cart.length === 0) {
        alert("O carrinho está vazio.");
        return;
      }

      if (
        !nome ||
        !email ||
        !telefone ||
        !morada ||
        !codigoPostal ||
        !localidade
      ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,

          cliente: {
            nome,
            email,
            telefone,
            morada,
            codigoPostal,
            localidade,
            nif,
            observacoes,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar sessão Stripe");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar o pagamento.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h1>Checkout</h1>

      {cart.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <>
          <h2>Dados de Entrega</h2>

          <input
            type="text"
            placeholder="Nome Completo *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Telefone *"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Morada Completa *"
            value={morada}
            onChange={(e) => setMorada(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Código Postal *"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Localidade *"
            value={localidade}
            onChange={(e) => setLocalidade(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="NIF (opcional)"
            value={nif}
            onChange={(e) => setNif(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Observações (opcional)"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: "100px",
            }}
          />

          <h2 style={{ marginTop: "30px" }}>
            Resumo da Encomenda
          </h2>

          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <br />
                Tamanho: {item.size}
                <br />
                Quantidade: {item.qty || 1}
              </div>

              <div>
                {(item.price * (item.qty || 1)).toFixed(2)} €
              </div>
            </div>
          ))}

          <h2 style={{ marginTop: "25px" }}>
            Total: {total.toFixed(2)} €
          </h2>

          <button
            onClick={pay}
            disabled={loading}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "15px",
              background: "#1d4ed8",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {loading
              ? "A redirecionar para o Stripe..."
              : "Pagar com Cartão"}
          </button>
        </>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};