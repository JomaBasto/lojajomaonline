import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Success() {
  useEffect(() => {
    // Limpa o carrinho após pagamento confirmado
    localStorage.removeItem("cart");
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "60px auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "70px",
          marginBottom: "20px",
        }}
      >
        ✅
      </div>

      <h1 style={{ color: "#16a34a" }}>
        Pagamento efetuado com sucesso!
      </h1>

      <p
        style={{
          fontSize: "18px",
          marginTop: "20px",
          lineHeight: "1.7",
        }}
      >
        Obrigado pela sua compra na
        <strong> JOMA Basto</strong>.
      </p>

      <p style={{ lineHeight: "1.7" }}>
        Recebemos o seu pagamento e a sua encomenda foi registada com sucesso.
      </p>

      <hr style={{ margin: "30px 0" }} />

      <h2>O que acontece agora?</h2>

      <div
        style={{
          textAlign: "left",
          maxWidth: "500px",
          margin: "25px auto",
          lineHeight: "2",
        }}
      >
        ✔ A encomenda será preparada.

        <br />

        ✔ Será enviada o mais rapidamente possível.

        <br />

        ✔ Em breve receberá um email com a confirmação da encomenda.

        <br />

        ✔ Se existir código de rastreio, será enviado posteriormente.
      </div>

      <Link to="/">
        <button
          style={{
            marginTop: "30px",
            padding: "15px 35px",
            background: "#1d4ed8",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Continuar a Comprar
        </button>
      </Link>
    </div>
  );
}