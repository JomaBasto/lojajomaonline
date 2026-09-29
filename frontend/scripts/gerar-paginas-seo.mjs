import fs from "node:fs/promises";
import path from "node:path";

const API_URL = "https://jomabasto-backend.onrender.com/produtos";
const BASE_URL = "https://www.jomabasto.com";

const distIndex = path.resolve("dist/index.html");

const response = await fetch(API_URL);

if (!response.ok) {
  throw new Error(`Erro ao carregar produtos: ${response.status}`);
}

const produtos = await response.json();
let template = await fs.readFile(distIndex, "utf8");

let criados = 0;

for (const produto of produtos) {
  if (!produto?._id || !produto?.name) continue;

  const id = produto._id;
  const nome = produto.name;
  const url = `${BASE_URL}/produto/${id}`;
  const description = (
    produto.description ||
    `${nome} disponível na JomaBasto.`
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const price =
    produto.promoPrice != null
      ? produto.promoPrice
      : produto.price;

  const image = produto.images?.[0] || `${BASE_URL}/jomabasto.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nome,
    image: produto.images || [image],
    description: produto.description || description,
    brand: {
      "@type": "Brand",
      name: "Joma",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: String(price ?? ""),
      availability: "https://schema.org/InStock",
    },
  };

  let html = template;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(nome)} | JomaBasto</title>`
  );

  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${escapeHtml(nome)} | JomaBasto" />`
  );

  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );

  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${url}" />`
  );

  html = html.replace(
    /<meta\s+property="og:image"[\s\S]*?\/>/,
    `<meta property="og:image" content="${escapeHtml(image)}" />`
  );

  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}" />`
  );

  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      "</head>",
      `    <link rel="canonical" href="${url}" />\n  </head>`
    );
  }

  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
  );

  const outputDir = path.resolve("dist/produto", id);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, "index.html"),
    html,
    "utf8"
  );

  criados++;
}

console.log(`Páginas SEO criadas: ${criados}`);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
