export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://jomabasto-backend.onrender.com/produtos"
    );

    if (!response.ok) {
      throw new Error(`API produtos respondeu ${response.status}`);
    }

    const products = await response.json();

    if (!Array.isArray(products)) {
      throw new Error("A API não devolveu uma lista de produtos");
    }

    const escapeXml = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const items = products
      .filter((product) => product && product._id && product.name)
      .map((product) => {
        const price = Number(product.price);
        const promoPrice =
          product.promoPrice != null
            ? Number(product.promoPrice)
            : null;

        const image =
          Array.isArray(product.images) && product.images.length
            ? product.images[0]
            : "";

        const productUrl =
          `https://www.jomabasto.com/produto/${encodeURIComponent(product._id)}`;

        const availability =
          Array.isArray(product.sizes) && product.sizes.length > 0
            ? "in_stock"
            : "out_of_stock";

        let item = `
    <item>
      <g:id>${escapeXml(product._id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description || product.name)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${Number.isFinite(price) ? price.toFixed(2) : "0.00"} EUR</g:price>
      <g:brand>Joma</g:brand>`;

        if (Number.isFinite(promoPrice) && promoPrice < price) {
          item += `
      <g:sale_price>${promoPrice.toFixed(2)} EUR</g:sale_price>`;
        }

        item += `
    </item>`;

        return item;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>JomaBasto</title>
    <link>https://www.jomabasto.com</link>
    <description>Produtos JomaBasto</description>
${items}
  </channel>
</rss>`;

    res.status(200);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=300, s-maxage=1800"
    );
    res.send(xml);
  } catch (error) {
    console.error("ERRO META FEED:", error);

    res.status(500).send(
      `Erro ao gerar feed Meta: ${error.message}`
    );
  }
}

