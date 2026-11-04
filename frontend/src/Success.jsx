import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

export default function Success() {
  const [purchase] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pending_purchase") || "null");
    } catch {
      return null;
    }
  });

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

  const formatPrice = (value) =>
    Number(value || 0).toLocaleString("pt-PT", {
      style: "currency",
      currency: purchase?.currency || "EUR",
    });

  const items = Array.isArray(purchase?.items) ? purchase.items : [];

  return (
    <>
      <style>{`
        .success-page {
          min-height: 70vh;
          padding: 35px 16px;
          background: #f3f5f8;
          box-sizing: border-box;
        }

        .success-card {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          padding: 38px;
          background: #fff;
          border: 1px solid #e5eaf0;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.07);
          color: #172b3a;
          text-align: center;
          box-sizing: border-box;
        }

        .success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: #e8f7ed;
          color: #168447;
          font-size: 38px;
          font-weight: 700;
        }

        .success-card h1 {
          margin: 0;
          color: #168447;
          font-size: 30px;
          line-height: 1.2;
        }

        .success-subtitle {
          margin: 12px 0 26px;
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
        }

        .success-details {
          padding: 25px;
          border-radius: 12px;
          background: #f8fafc;
          text-align: left;
        }

        .success-details h2 {
          margin: 0 0 22px;
          font-size: 20px;
          line-height: 1.4;
        }

        .order-summary {
          margin-bottom: 24px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
        }

        .order-summary h3 {
          margin: 0 0 18px;
          font-size: 17px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          padding: 13px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .order-item-name {
          font-weight: 700;
          font-size: 14px;
          line-height: 1.5;
        }

        .order-item-info {
          margin-top: 4px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .order-item-price {
          white-space: nowrap;
          font-size: 14px;
          font-weight: 700;
        }

        .order-total-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
          font-size: 14px;
        }

        .order-total-final {
          margin-top: 17px;
          padding-top: 15px;
          border-top: 1px solid #dbe2ea;
          font-size: 18px;
          font-weight: 800;
        }

        .order-note {
          margin: 14px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .success-step {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 17px 0;
        }

        .success-step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #e8f7ed;
          color: #168447;
          font-size: 19px;
        }

        .success-step strong {
          display: block;
          margin-bottom: 3px;
          font-size: 14px;
        }

        .success-step span {
          display: block;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .success-brand {
          margin: 27px 0 22px;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .success-brand span {
          display: block;
          margin-top: 5px;
          color: #64748b;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .success-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .success-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px 22px;
          border: 1px solid #dbe2ea;
          border-radius: 9px;
          background: #fff;
          color: #334155;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
        }

        .success-button:hover {
          background: #f8fafc;
        }

        .success-button-primary {
          border-color: #1d4ed8;
          background: #1d4ed8;
          color: #fff;
        }

        .success-button-primary:hover {
          background: #1e40af;
          color: #fff;
        }

        @media (max-width: 600px) {
          .success-page {
            padding: 22px 12px;
          }

          .success-card {
            padding: 25px 17px;
            border-radius: 14px;
          }

          .success-card h1 {
            font-size: 25px;
          }

          .success-details {
            padding: 18px 14px;
          }

          .success-details h2 {
            font-size: 18px;
          }

          .order-summary {
            padding: 14px 11px;
          }

          .order-item {
            gap: 8px;
          }

          .order-item-name {
            overflow-wrap: anywhere;
          }

          .success-buttons {
            flex-direction: column;
          }

          .success-button {
            width: 100%;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm;
          }

          body {
            background: #fff !important;
          }

          .success-page {
            min-height: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .success-card {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <main className="success-page">
        <div className="success-card">
          <div className="success-icon" aria-hidden="true">✓</div>

          <h1>Pagamento concluído!</h1>

          <p className="success-subtitle">
            Obrigado pela tua encomenda na JomaBasto.
          </p>

          <section className="success-details">
            <h2>A tua encomenda foi recebida com sucesso.</h2>

            {items.length > 0 && (
              <div className="order-summary">
                <h3>Resumo da encomenda</h3>

                {items.map((item, index) => (
                  <div className="order-item" key={`${item.item_id || item.item_name}-${index}`}>
                    <div>
                      <div className="order-item-name">
                        {item.item_name || "Artigo"}
                      </div>
                      <div className="order-item-info">
                        {item.size ? `Tamanho: ${item.size} · ` : ""}
                        Quantidade: {item.quantity || 1}
                      </div>
                    </div>

                    <div className="order-item-price">
                      {formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}
                    </div>
                  </div>
                ))}

                <div className="order-total-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(purchase.subtotal)}</span>
                </div>

                <div className="order-total-row">
                  <span>Portes de envio</span>
                  <span>{formatPrice(purchase.shipping)}</span>
                </div>

                <div className="order-total-row order-total-final">
                  <span>Total</span>
                  <span>{formatPrice(purchase.value)}</span>
                </div>

                <p className="order-note">
                  Resumo dos dados preparados no checkout.
                </p>
              </div>
            )}

            <hr style={{ border: 0, borderTop: "1px solid #dbe2ea" }} />

            <h3 style={{ margin: "20px 0", fontSize: "16px" }}>
              O que acontece agora?
            </h3>

            <div className="success-step">
              <div className="success-step-icon" aria-hidden="true">✓</div>
              <div>
                <strong>Preparação</strong>
                <span>Vamos preparar a tua encomenda.</span>
              </div>
            </div>

            <div className="success-step">
              <div className="success-step-icon" aria-hidden="true">↗</div>
              <div>
                <strong>Envio</strong>
                <span>Será enviada o mais rapidamente possível.</span>
              </div>
            </div>

            <div className="success-step">
              <div className="success-step-icon" aria-hidden="true">✉</div>
              <div>
                <strong>Confirmação por e-mail</strong>
                <span>Receberás a confirmação da encomenda por e-mail.</span>
              </div>
            </div>

            <div className="success-step">
              <div className="success-step-icon" aria-hidden="true">⌖</div>
              <div>
                <strong>Rastreio</strong>
                <span>Se existir código de rastreio, será enviado posteriormente.</span>
              </div>
            </div>
          </section>

          <div className="success-brand">
            JOMA BASTO
            <span>Obrigado por escolheres a nossa loja!</span>
          </div>

          <div className="success-buttons no-print">
            <button
              type="button"
              className="success-button"
              onClick={() => window.print()}
            >
              Imprimir / Guardar em PDF
            </button>

            <Link to="/" className="success-button success-button-primary">
              Continuar a Comprar
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}