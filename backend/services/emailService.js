import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

console.log("MONGO:", !!process.env.MONGO_URL);
console.log("JWT:", !!process.env.JWT_SECRET);
console.log("STRIPE:", !!process.env.STRIPE_SECRET_KEY);
console.log("RESEND:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

// ================================
// EMAIL DE TESTE
// ================================

export async function sendTestEmail() {
  try {
    const response = await resend.emails.send({
      from: "Loja JOMA Basto <noreply@send.jomabasto.com>",
      to: "apoio@jomabasto.com",
      subject: "Teste JOMA Basto",
      html: `
        <h2>✅ Email de teste</h2>

        <p>O sistema de emails está a funcionar corretamente.</p>
      `,
    });
    console.log("Resposta Resend Cliente:", response);

    console.log("✅ Email de teste enviado");

  } catch (err) {
    console.log(err);
  }
}

// ================================
// EMAIL PARA O CLIENTE
// ================================

export async function sendCustomerEmail(order) {

  try {

    await resend.emails.send({

      from: "Loja JOMA Basto <noreply@send.jomabasto.com>",

      to: order.cliente.email,

      subject: "Recebemos a sua encomenda ✔",

      html: `

      <h2>Obrigado pela sua compra!</h2>

      <p>Olá <strong>${order.cliente.nome}</strong>,</p>

      <p>A sua encomenda foi recebida com sucesso.</p>

      <p><strong>Total:</strong> ${order.total.toFixed(2)} €</p>

      <p>

      ${order.cliente.morada}<br>

      ${order.cliente.codigoPostal} ${order.cliente.localidade}

      </p>

      <p>Entraremos em contacto em breve.</p>

      `,

    });

    console.log("✅ Email enviado ao cliente");

  } catch (err) {

    console.log(err);

  }

}

// ================================
// EMAIL PARA A LOJA
// ================================

export async function sendAdminEmail(order) {

  try {

    const produtosHtml = order.items
  .map(
    (item) => `
      <li>
        <strong>${item.name}</strong><br>
        Tamanho: ${item.size || "-"}<br>
        Quantidade: ${item.qty || 1}<br>
        Preço: ${item.price.toFixed(2)} €
      </li>
    `
  )
  .join("");

    await resend.emails.send({

      from: "Loja JOMA Basto <noreply@send.jomabasto.com>",

      to: "apoio@jomabasto.com",

      subject: "Nova encomenda recebida",

      html: `

      <h2>Nova encomenda</h2>

      <p><strong>Cliente:</strong> ${order.cliente.nome}</p>

<p><strong>Email:</strong> ${order.cliente.email}</p>

<p><strong>Telefone:</strong> ${order.cliente.telefone}</p>

<p><strong>Morada:</strong> ${order.cliente.morada}</p>

<p><strong>Código Postal:</strong> ${order.cliente.codigoPostal}</p>

<p><strong>Localidade:</strong> ${order.cliente.localidade}</p>

<p><strong>NIF:</strong> ${order.cliente.nif || "-"}</p>

<p><strong>Observações:</strong> ${order.cliente.observacoes || "Sem observações"}</p>

<h3>Produtos</h3>

      <ul>
        ${produtosHtml}
      </ul>

      <p><strong>Total:</strong> ${order.total.toFixed(2)} €</p>

      `,

    });

    console.log("✅ Email enviado para a loja");

  } catch (err) {

    console.log(err);

  }

}
// ================================
// CONVITE PARA AVALIAR PRODUTOS
// ================================

export async function sendReviewInvitationEmail(order, token) {
  if (process.env.DISABLE_EMAILS === "true") {
    return { skipped: true };
  }

  if (!/^[a-f0-9]{64}$/.test(token || "")) {
    throw new Error("Token de avaliação inválido.");
  }

  const email = order?.cliente?.email;
  const nome = order?.cliente?.nome || "Cliente";
  const items = (order?.items || []).filter(item => item.produtoId);

  if (!email || items.length === 0) {
    throw new Error("A encomenda não tem email ou produtos elegíveis para avaliação.");
  }

  const escapar = valor => String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);

  const produtosHtml = items.map(item =>
    `<li>${escapar(item.name)} — Quantidade: ${Number(item.qty) || 1}</li>`
  ).join("");

  const base = process.env.REVIEW_BASE_URL || "https://www.jomabasto.com";
  const link = base + "/avaliar/" + token;

  const response = await resend.emails.send({
    from: "Loja JOMA Basto <noreply@send.jomabasto.com>",
    to: email,
    subject: "Conte-nos a sua opinião sobre a sua compra",
    html: `
      <h2>Olá ${escapar(nome)}!</h2>
      <p>A sua encomenda foi entregue. Gostaríamos de conhecer a sua opinião sobre os produtos que comprou.</p>
      <ul>${produtosHtml}</ul>
      <p><a href="${link}">Escrever uma avaliação</a></p>
      <p>O convite é válido durante 30 dias.</p>
      <p>Obrigado por comprar na JOMA Basto.</p>
    `
  });

  if (response?.error) {
    throw new Error("O serviço de email não conseguiu enviar o convite.");
  }

  return response;
}

// ================================
// EMAIL DE ATUALIZACAO DA ENCOMENDA
// ================================

export async function sendOrderStatusEmail(order, status) {
  if (process.env.DISABLE_EMAILS === "true") {
    return { skipped: true };
  }

  const email = order?.cliente?.email;
  if (!email) {
    throw new Error("A encomenda nao tem email de cliente.");
  }

  const escapar = valor => String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);

  const nome = escapar(order.cliente.nome || "Cliente");
  const estado = escapar(status);
  const transportadora = escapar(order.transportadora);
  const codigo = escapar(order.codigoSeguimento);

  let linkHtml = "";
  try {
    const url = new URL(order.linkSeguimento || "");
    if (url.protocol === "https:") {
      linkHtml = `<p><a href="${escapar(url.href)}">Acompanhar envio</a></p>`;
    }
  } catch {
    // Link ausente ou invalido: nao incluir ligacao no email.
  }

  const detalhesEnvio = [
    transportadora ? `<p><strong>Transportadora:</strong> ${transportadora}</p>` : "",
    codigo ? `<p><strong>Codigo de seguimento:</strong> ${codigo}</p>` : "",
    linkHtml
  ].join("");

  const response = await resend.emails.send({
    from: "Loja JOMA Basto <noreply@send.jomabasto.com>",
    to: email,
    subject: `Atualizacao da sua encomenda: ${status}`,
    html: `
      <h2>Atualizacao da encomenda</h2>
      <p>Ola <strong>${nome}</strong>,</p>
      <p>O estado da sua encomenda foi atualizado para: <strong>${estado}</strong>.</p>
      ${detalhesEnvio}
      <p>Obrigado por comprar na JOMA Basto.</p>
    `
  });

  if (response?.error) {
    throw new Error("Nao foi possivel enviar o email de atualizacao.");
  }

  return response;
}
