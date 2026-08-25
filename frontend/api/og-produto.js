export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("ID do produto em falta");
  }

  const userAgent = req.headers["user-agent"] || "";

  const isBot =
    /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Googlebot|bingbot/i.test(
      userAgent
    );

  const productUrl = `https://www.jomabasto.com/produto/${encodeURIComponent(id)}`;

  if (!isBot) {
    return res.redirect(302, productUrl);
  }

  try {
    const response = await fetch(
      `https://jomabasto-backend.onrender.com/produto/${encodeURIComponent(id)}`
    );

    let html = await response.text();

    html = html.replace(
      /<meta http-equiv="refresh"[^>]*>/i,
      '<meta name="robots" content="noindex">'
    );

    res.status(response.status);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("ERRO OG:", err);
    res.status(500).send("Erro ao carregar metadados do produto");
  }
}
