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

    const productsResponse = await fetch(
      "https://jomabasto-backend.onrender.com/produtos"
    );

    if (productsResponse.ok) {
      const products = await productsResponse.json();
      const produto = products.find((p) => p._id === id);

      if (produto) {
        const finalPrice =
          produto.promoPrice != null
            ? Number(produto.promoPrice)
            : Number(produto.price);

        if (Number.isFinite(finalPrice)) {
          html = html.replace(
            /(<meta\s+property=["']product:price:amount["']\s+content=["'])[^"']*(["'][^>]*>)/i,
            `$1${finalPrice}$2`
          );
        }
      }
    }

    res.status(response.status);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("ERRO OG:", err);
    res.status(500).send("Erro ao carregar metadados do produto");
  }
}
