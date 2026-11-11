import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://jomabasto-backend.onrender.com";

export default function ReviewPage() {
  const { token } = useParams();

  const [produtos, setProdutos] = useState([]);
  const [classificacoes, setClassificacoes] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [submetidos, setSubmetidos] = useState({});
  const [aCarregar, setACarregar] = useState(true);
  const [aSubmeter, setASubmeter] = useState({});
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarConvite() {
      try {
        setACarregar(true);
        setErro("");

        const resposta = await fetch(
          `${API_URL}/avaliacoes/convite/${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.error || "Este convite é inválido ou expirou."
          );
        }

        setProdutos(
          Array.isArray(dados.produtos) ? dados.produtos : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setErro(err.message || "Não foi possível validar o convite.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setACarregar(false);
        }
      }
    }

    if (token) {
      carregarConvite();
    } else {
      setErro("O link de avaliação não é válido.");
      setACarregar(false);
    }

    return () => controller.abort();
  }, [token]);

  async function submeterAvaliacao(produtoId) {
    const classificacao = classificacoes[produtoId];
    const comentario = comentarios[produtoId] || "";

    if (!classificacao) {
      setErro("Escolha uma classificação entre 1 e 5 estrelas.");
      return;
    }

    if (comentario.length > 2000) {
      setErro("O comentário não pode ultrapassar 2000 caracteres.");
      return;
    }

    try {
      setErro("");
      setMensagem("");
      setASubmeter((anterior) => ({
        ...anterior,
        [produtoId]: true,
      }));

      const resposta = await fetch(
        `${API_URL}/avaliacoes/convite/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            produtoId,
            classificacao,
            comentario,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.error || "Não foi possível guardar a avaliação."
        );
      }

      setSubmetidos((anterior) => ({
        ...anterior,
        [produtoId]: true,
      }));

      setMensagem(
        "A avaliação foi recebida e aguarda aprovação."
      );
    } catch (err) {
      setErro(err.message || "Ocorreu um erro ao enviar a avaliação.");
    } finally {
      setASubmeter((anterior) => ({
        ...anterior,
        [produtoId]: false,
      }));
    }
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: "24px 18px",
        color: "#292929",
        fontFamily: "inherit",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>
          Avalie a sua experiência
        </h1>
        <p style={{ color: "#666", lineHeight: 1.6 }}>
          A sua opinião ajuda-nos a melhorar e ajuda outros clientes
          a conhecer os nossos produtos.
        </p>
      </header>

      {aCarregar && <p>A validar o convite...</p>}

      {!aCarregar && erro && (
        <p
          role="alert"
          style={{
            padding: 14,
            background: "#fff1f0",
            color: "#a12622",
            borderRadius: 6,
          }}
        >
          {erro}
        </p>
      )}

      {mensagem && (
        <p
          role="status"
          style={{
            padding: 14,
            background: "#edf7ed",
            color: "#256029",
            borderRadius: 6,
          }}
        >
          {mensagem}
        </p>
      )}

      {!aCarregar && !erro && produtos.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          Não existem produtos por avaliar neste convite. Obrigado!
        </p>
      )}

      {produtos.map((produto) => {
        const id = String(produto.produtoId);
        const enviado = Boolean(submetidos[id]);

        return (
          <section
            key={id}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: 20,
              marginBottom: 20,
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 18,
              }}
            >
              {produto.image && (
                <img
                  src={produto.image}
                  alt={produto.name || "Produto"}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "contain",
                    borderRadius: 6,
                  }}
                />
              )}

              <div>
                <h2 style={{ fontSize: 19, margin: "0 0 6px" }}>
                  {produto.name}
                </h2>
                {produto.reference && (
                  <p style={{ color: "#777", margin: 0, fontSize: 13 }}>
                    Referência: {produto.reference}
                  </p>
                )}
              </div>
            </div>

            {enviado ? (
              <p style={{ color: "#256029", marginBottom: 0 }}>
                <strong>Avaliação enviada.</strong> Obrigado pela sua opinião!
              </p>
            ) : (
              <>
                <p style={{ marginBottom: 8 }}>
                  A sua classificação
                </p>

                <div
                  role="group"
                  aria-label={`Classificação de ${produto.name}`}
                  style={{ display: "flex", gap: 8, marginBottom: 18 }}
                >
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <button
                      key={estrela}
                      type="button"
                      aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
                      aria-pressed={classificacoes[id] === estrela}
                      onClick={() =>
                        setClassificacoes((anterior) => ({
                          ...anterior,
                          [id]: estrela,
                        }))
                      }
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: 2,
                        fontSize: 32,
                        color:
                          estrela <= (classificacoes[id] || 0)
                            ? "#e5a000"
                            : "#c9c9c9",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <label
                  htmlFor={`comentario-${id}`}
                  style={{ display: "block", marginBottom: 8 }}
                >
                  Comentário (opcional)
                </label>

                <textarea
                  id={`comentario-${id}`}
                  value={comentarios[id] || ""}
                  onChange={(evento) =>
                    setComentarios((anterior) => ({
                      ...anterior,
                      [id]: evento.target.value,
                    }))
                  }
                  maxLength={2000}
                  rows={4}
                  placeholder="Conte-nos como foi a sua experiência..."
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 12,
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    resize: "vertical",
                    font: "inherit",
                  }}
                />

                <p style={{ color: "#777", fontSize: 12, textAlign: "right" }}>
                  {(comentarios[id] || "").length}/2000
                </p>

                <button
                  type="button"
                  disabled={Boolean(aSubmeter[id])}
                  onClick={() => submeterAvaliacao(id)}
                  style={{
                    border: "none",
                    borderRadius: 6,
                    padding: "12px 20px",
                    background: "#292929",
                    color: "#fff",
                    cursor: aSubmeter[id] ? "wait" : "pointer",
                    opacity: aSubmeter[id] ? 0.65 : 1,
                  }}
                >
                  {aSubmeter[id] ? "A enviar..." : "Enviar avaliação"}
                </button>
              </>
            )}
          </section>
        );
      })}

      <p
        style={{
          textAlign: "center",
          color: "#777",
          fontSize: 13,
          lineHeight: 1.5,
          marginTop: 28,
        }}
      >
        As avaliações são verificadas e ficam pendentes de aprovação
        antes de serem publicadas.
      </p>
    </main>
  );
}
