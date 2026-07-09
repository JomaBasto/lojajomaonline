import dotenv from "dotenv";

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
      to: "soniafernande@sapo.pt",
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

    await resend.emails.send({

      from: "Loja JOMA Basto <noreply@send.jomabasto.com>",

      to: "soniafernande@sapo.pt",

      subject: "Nova encomenda recebida",

      html: `

      <h2>Nova encomenda</h2>

      <p><strong>Cliente:</strong> ${order.cliente.nome}</p>

      <p><strong>Email:</strong> ${order.cliente.email}</p>

      <p><strong>Telefone:</strong> ${order.cliente.telefone}</p>

      <p><strong>Total:</strong> ${order.total.toFixed(2)} €</p>

      `,

    });

    console.log("✅ Email enviado para a loja");

  } catch (err) {

    console.log(err);

  }

}