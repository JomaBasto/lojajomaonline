import fs from "node:fs/promises";

const API_URL = "https://jomabasto-backend.onrender.com/produtos";
const BASE_URL = "https://jomabasto.com";

const response = await fetch(API_URL);

if (!response.ok) {
  throw new Error(`Erro ao carregar produtos: ${response.status}`);
}

const produtos = await response.json();

const urlsFixas = [
  {
    loc: `${BASE_URL}/`,
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: `${BASE_URL}/quem-somos`,
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    loc: `${BASE_URL}/promocao`,
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    loc: `${BASE_URL}/condicoes-de-utilizacao`,
    changefreq: "yearly",
    priority: "0.5",
  },
];

const urlsProdutos = produtos
  .filter((produto) => produto && produto._id)
  .map((produto) => ({
    loc: `${BASE_URL}/produto/${produto._id}`,
    changefreq: "weekly",
    priority: "0.8",
  }));

const urls = [...urlsFixas, ...urlsProdutos];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

await fs.writeFile("./public/sitemap.xml", xml, "utf8");

console.log(`Sitemap criado com ${urls.length} URLs.`);
console.log(`Produtos incluídos: ${urlsProdutos.length}`);
