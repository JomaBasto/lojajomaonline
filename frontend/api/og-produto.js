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
      "https://jomabasto-backend.onrender.com/produtos"
    );

    if (!response.ok) {
      throw new Error(`API produtos respondeu ${response.status}`);
    }

    const products = await response.json();
    const product = products.find((item) => item._id === id);

    if (!product) {
      return res.status(404).send("Produto não encontrado");
    }

    const name = product.name || "Produto Joma";
    const description =
      product.description ||
      `Compra ${name} na JomaBasto Store, loja Joma em Portugal.`;

    const image =
      Array.isArray(product.images) && product.images.length
        ? product.images[0]
        : "";

    const price = Number(product.promoPrice || product.price || 0);

    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const safeName = escapeHtml(name);
    const safeDescription = escapeHtml(description);
    const safeImage = escapeHtml(image);
    const safeUrl = escapeHtml(productUrl);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      image: Array.isArray(product.images) ? product.images : [],
      brand: {
        "@type": "Brand",
        name: "Joma"
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "EUR",
        price: price.toFixed(2),
        availability: "https://schema.org/InStock"
      }
    };

    const html = `<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <title>${safeName} | JomaBasto</title>
  <meta name="description" content="${safeDescription.substring(0, 160)}">
  <link rel="canonical" href="${safeUrl}">

  <meta property="og:title" content="${safeName} | JomaBasto">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${safeUrl}">
  ${safeImage ? `<meta property="og:image" content="${safeImage}">` : ""}

  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <main>
    <h1>${safeName}</h1>
    ${safeImage ? `<img src="${safeImage}" alt="${safeName}">` : ""}
    <p>${safeDescription}</p>
    <p>${price.toFixed(2)} €</p>
    <a href="${safeUrl}">Ver produto</a>
  </main>
</body>
</html>`;

    res.status(200);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    res.send(html);
  } catch (err) {
    console.error("ERRO OG:", err);
    res.status(500).send("Erro ao carregar metadados do produto");
  }
}
