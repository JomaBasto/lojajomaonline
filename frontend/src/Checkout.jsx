import { useState, useEffect } from "react";
import ReactGA from "react-ga4";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [multibancoData, setMultibancoData] = useState(null);

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

  const shippingCost = total >= 70 || total === 0 ? 0 : 5.95;

  const API_URL = "https://jomabasto-backend.onrender.com";
  useEffect(() => {
    if (cart.length === 0) return;

    ReactGA.event("begin_checkout", {
      currency: "EUR",
      value: total + shippingCost,
      items: cart.map((item) => ({
        item_id: item._id,
        item_name: item.name,
        price: Number(item.price),
        quantity: item.qty || 1,
        item_variant: item.size,
      })),
    });
  }, [cart.length, total, shippingCost]);
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
          shippingCost,

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

      localStorage.setItem(
        "pending_purchase",
        JSON.stringify({
          transaction_id: data.sessionId || `order_${Date.now()}`,
          value: total + shippingCost,
          currency: "EUR",
          payment_method: "stripe",
          subtotal: total,
          shipping: shippingCost,
          customer: {
            nome,
            email,
            telefone,
            morada,
            codigoPostal,
            localidade,
            nif,
          },
          items: cart.map((item) => ({
            item_id: item._id,
            item_name: item.name,
            price: item.price,
            quantity: item.qty || 1,
            size: item.size,
          })),
        })
      );

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar o pagamento.");
      setLoading(false);
    }
  };

  const payMultibanco = async () => {
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

      const res = await fetch(`${API_URL}/create-multibanco-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          shippingCost,
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
        throw new Error(data.error || "Erro ao criar encomenda Multibanco");
      }

      setMultibancoData(data);
      setLoading(false);

      localStorage.setItem(
        "pending_purchase",
        JSON.stringify({
          transaction_id: data.orderId,
          value: Number(data.valor),
          currency: "EUR",
          payment_method: "multibanco",
          subtotal: total,
          shipping: shippingCost,
          customer: {
            nome,
            email,
            telefone,
            morada,
            codigoPostal,
            localidade,
            nif,
          },
          items: cart.map((item) => ({
            item_id: item._id,
            item_name: item.name,
            price: item.price,
            quantity: item.qty || 1,
            size: item.size,
          })),
        })
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao criar a encomenda Multibanco.");
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

          <p>
  Subtotal: {total.toFixed(2)} €
</p>

<p>
  Portes: {shippingCost.toFixed(2)} €
</p>

<h2 style={{ marginTop: "25px" }}>
  Total: {(total + shippingCost).toFixed(2)} €
</h2>

          <h2 style={{ marginTop: "30px" }}>
            Forma de Pagamento
          </h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("stripe");
                setMultibancoData(null);
              }}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "15px",
                border: paymentMethod === "stripe"
                  ? "2px solid #1d4ed8"
                  : "1px solid #ccc",
                borderRadius: "8px",
                background: paymentMethod === "stripe"
                  ? "#eff6ff"
                  : "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              💳 Cartão
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentMethod("multibanco");
                setMultibancoData(null);
              }}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "15px",
                border: paymentMethod === "multibanco"
                  ? "2px solid #1d4ed8"
                  : "1px solid #ccc",
                borderRadius: "8px",
                background: paymentMethod === "multibanco"
                  ? "#eff6ff"
                  : "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              🏧 Multibanco
            </button>
          </div>

          {paymentMethod === "stripe" && (
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
          )}

          {paymentMethod === "multibanco" && !multibancoData && (
            <button
              onClick={payMultibanco}
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
                ? "A criar encomenda..."
                : "Continuar com Multibanco"}
            </button>
          )}

          {multibancoData && (
            <div className="multibanco-print" style={{
              maxWidth: "720px", margin: "32px auto", padding: "30px",
              border: "1px solid #dbe2ea", borderRadius: "12px",
              background: "#fff", color: "#172b3a",
              fontFamily: "Arial, Helvetica, sans-serif", boxSizing: "border-box"
            }}>
              <style>{`
                @media print {
                  @page { size: A4 portrait; margin: 8mm; }
                  body * { visibility: hidden !important; }
                  .multibanco-print, .multibanco-print * { visibility: visible !important; }
                  .multibanco-print {
                    position: absolute !important; left: 0 !important; top: 0 !important;
                    width: 100% !important; max-width: none !important;
                    margin: 0 !important; padding: 0 !important;
                    border: 0 !important; box-shadow: none !important;
                    border-radius: 0 !important; background: #fff !important;
                    color: #111 !important;
                    font-size: 11px !important;
                    line-height: 1.35 !important;
                  }
                  .multibanco-print .no-print { display: none !important; }
                }
              `}</style>

              <header style={{
                display: "flex", alignItems: "center", gap: "14px",
                paddingBottom: "18px", borderBottom: "2px solid #173b57",
                marginBottom: "20px"
              }}>
                <div style={{
                  width: "44px", height: "44px", background: "#173b57",
                  color: "#fff", display: "flex", alignItems: "center",
                  justifyContent: "center", borderRadius: "8px",
                  fontSize: "24px", fontWeight: "bold"
                }}>J</div>
                <div>
                  <div style={{fontSize: "23px", fontWeight: "800", letterSpacing: "0px", color: "#173b57"}}>JOMA BASTO</div>
                  <div style={{fontSize: "11px", letterSpacing: "0.5px", color: "#64748b", marginTop: "4px"}}>COMPROVATIVO DE PAGAMENTO</div>
                </div>
              </header>

              <h2 style={{fontSize: "23px", margin: "0 0 8px", color: "#173b57"}}>Encomenda e pagamento</h2>
              <p style={{margin: "0 0 20px", color: "#526171", lineHeight: "1.6"}}>
                A encomenda foi registada. Guarde este documento para concluir o pagamento.
              </p>

              <section style={{padding: "16px", border: "1px solid #dbe2ea", borderRadius: "8px", marginBottom: "20px"}}>
                <h3 style={{fontSize: "15px", margin: "0 0 12px", color: "#173b57"}}>IDENTIFICAÇÃO DA ENCOMENDA</h3>
                <p style={{margin: "6px 0"}}><strong>Número da encomenda:</strong> {multibancoData.orderId || "Não disponível"}</p>
                <p style={{margin: "6px 0"}}><strong>Nome:</strong> {nome || "Não indicado"}</p>
                <p style={{margin: "6px 0"}}><strong>Email:</strong> {email || "Não indicado"}</p>
                <p style={{margin: "6px 0"}}><strong>Telefone:</strong> {telefone || "Não indicado"}</p>
              </section>

              <section style={{marginBottom: "22px"}}>
                <h3 style={{fontSize: "16px", color: "#173b57", borderBottom: "1px solid #dbe2ea", paddingBottom: "10px"}}>RESUMO DA ENCOMENDA</h3>
                {cart.map((item, index) => (
                  <div key={index} style={{
                    display: "flex", justifyContent: "space-between", gap: "16px",
                    padding: "12px 0", borderBottom: "1px solid #e8edf2"
                  }}>
                    <div>
                      <strong>{item.name}</strong>
                      <div style={{fontSize: "13px", color: "#526171", marginTop: "5px"}}>
                        Tamanho: {item.size || "N/A"} | Quantidade: {item.qty || 1}
                      </div>
                    </div>
                    <strong style={{whiteSpace: "nowrap"}}>
                      {(Number(item.price || 0) * (item.qty || 1)).toLocaleString("pt-PT", {style: "currency", currency: "EUR"})}
                    </strong>
                  </div>
                ))}
                <div style={{marginTop: "14px", fontSize: "14px"}}>
                  <p style={{display: "flex", justifyContent: "space-between", margin: "8px 0"}}>
                    <span>Subtotal</span>
                    <span>{Number(total).toLocaleString("pt-PT", {style: "currency", currency: "EUR"})}</span>
                  </p>
                  <p style={{display: "flex", justifyContent: "space-between", margin: "8px 0"}}>
                    <span>Portes de envio</span>
                    <span>{Number(shippingCost).toLocaleString("pt-PT", {style: "currency", currency: "EUR"})}</span>
                  </p>
                  <div style={{
                    display: "flex", justifyContent: "space-between", gap: "12px",
                    marginTop: "14px", padding: "15px", background: "#f0f5f8",
                    borderRadius: "7px", fontSize: "20px", fontWeight: "800", color: "#173b57"
                  }}>
                    <span>Total</span>
                    <span>{Number(total + shippingCost).toLocaleString("pt-PT", {style: "currency", currency: "EUR"})}</span>
                  </div>
                </div>
              </section>

              <section style={{border: "1px solid #dbe2ea", borderRadius: "9px", padding: "20px", marginBottom: "18px"}}>
                <h3 style={{margin: "0 0 8px", color: "#173b57", fontSize: "19px"}}>Pagamento por Multibanco</h3>
                <p style={{fontSize: "13px", color: "#526171", lineHeight: "1.6"}}>
                  Utilize os dados seguintes para efetuar o pagamento.
                </p>
                <div style={{background: "#f3f6f9", borderRadius: "7px", padding: "16px"}}>
                  <div style={{fontSize: "11px", letterSpacing: "1.5px", color: "#64748b"}}>ENTIDADE</div>
                  <div style={{fontSize: "27px", fontWeight: "800", color: "#173b57", margin: "5px 0 16px"}}>{multibancoData.entidade}</div>
                  <div style={{borderTop: "1px solid #d7e0e8", paddingTop: "14px"}}>
                    <div style={{fontSize: "11px", letterSpacing: "1.5px", color: "#64748b"}}>REFERENCIA</div>
                    <div style={{fontSize: "25px", fontWeight: "800", color: "#173b57", overflowWrap: "anywhere", margin: "5px 0 16px"}}>{multibancoData.referencia}</div>
                  </div>
                  <div style={{borderTop: "1px solid #d7e0e8", paddingTop: "14px"}}>
                    <div style={{fontSize: "11px", letterSpacing: "1.5px", color: "#64748b"}}>VALOR A PAGAR</div>
                    <div style={{fontSize: "29px", fontWeight: "800", color: "#173b57", marginTop: "5px"}}>
                      {Number(multibancoData.valor).toLocaleString("pt-PT", {style: "currency", currency: "EUR"})}
                    </div>
                  </div>
                </div>
                <p style={{margin: "16px 0 0", fontWeight: "700", color: "#805b12"}}>
                  Estado: A aguardar pagamento
                </p>
              </section>

              <p style={{fontSize: "13px", lineHeight: "1.7", color: "#526171"}}>
                A encomenda será processada após a confirmação do pagamento. Guarde os dados de pagamento até concluir a operação.
              </p>
              <footer style={{borderTop: "1px solid #e0e7ee", paddingTop: "12px", marginTop: "18px", fontSize: "12px", color: "#64748b"}}>
                JOMA BASTO - Obrigado pela sua preferência.
              </footer>

              <div className="no-print" style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px"}}>
                <button type="button" onClick={() => window.print()} style={{
                  padding: "12px 20px", background: "#173b57", color: "#fff",
                  border: "none", borderRadius: "7px", cursor: "pointer", fontWeight: "700"
                }}>Imprimir / Guardar em PDF</button>
                <button type="button" onClick={() => { window.location.href = "/"; }} style={{
                  padding: "12px 20px", background: "#fff", color: "#173b57",
                  border: "1px solid #cbd5e1", borderRadius: "7px", cursor: "pointer"
                }}>Voltar a loja</button>
              </div>
            </div>
          )}
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
