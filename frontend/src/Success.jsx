import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

export default function Success() {

  useEffect(() => {

    const pending = localStorage.getItem("pending_purchase");

    if (!pending) {
      console.log("GA4: nenhuma compra pendente encontrada.");
      return;
    }

    try {

      const purchase = JSON.parse(pending);

      ReactGA.event("purchase", {
        transaction_id: purchase.transaction_id,
        value: Number(purchase.value),
        currency: purchase.currency || "EUR",
        items: purchase.items || [],
      });

      console.log("GA4: purchase enviado", purchase);

      localStorage.removeItem("pending_purchase");

      localStorage.removeItem("cart");

    } catch (error) {

      console.error("Erro ao enviar purchase para GA4:", error);

    }

  }, []);

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .success-card {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    <div
      className="success-card"
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

      <button
        type="button"
        className="no-print"
        onClick={() => window.print()}
        style={{
          marginTop: "30px",
          marginRight: "12px",
          padding: "15px 25px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Imprimir / Guardar em PDF
      </button>
      <Link to="/" className="no-print">
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
    </>
  );
}
