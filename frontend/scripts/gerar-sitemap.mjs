import fs from "node:fs/promises";

const API_URL = "https://jomabasto-backend.onrender.com/produtos";
const BASE_URL = "https://www.jomabasto.com";
const SITEMAP_PATH = "./public/sitemap.xml";

const response = await fetch(API_URL, {
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(15000),
});

if (!response.ok) {
  throw new Error(`Erro ao carregar produtos: HTTP ${response.status}`);
}

const produtos = await response.json();

if (!Array.isArray(produtos) || produtos.length === 0) {
  throw new Error(
    "A API não devolveu uma lista válida e não vazia. O sitemap existente será preservado."
  );
}

const produtosComIdValido = produtos.filter(
  (produto) =>
    produto && /^[a-f0-9]{24}$/i.test(String(produto._id ?? ""))
);

const idsRecebidos = produtosComIdValido.map((produto) =>
  String(produto._id)
);

if (idsRecebidos.length === 0) {
  throw new Error(
    "Não foram encontrados IDs válidos. O sitemap existente será preservado."
  );
}

if (new Set(idsRecebidos).size !== idsRecebidos.length) {
  throw new Error("A API devolveu IDs de produtos duplicados.");
}

// Só incluir produtos para os quais o gerador consegue criar uma página SEO.
const produtosPublicaveis = produtosComIdValido.filter((produto) =>
  obterNomePublicavel(produto.name)
);
const ids = produtosPublicaveis.map((produto) => String(produto._id));

if (ids.length === 0) {
  throw new Error(
    "Não foram encontrados produtos com nomes válidos. O sitemap existente será preservado."
  );
}

function obterNomePublicavel(valor) {
  const nomeOriginal = String(valor || "").trim();
  if (!nomeOriginal) return "";

  if (!/^https?:\/\//i.test(nomeOriginal)) return nomeOriginal;

  const match = nomeOriginal.match(/-,([^,]+),-TABELA/i);
  if (!match) return "";

  try {
    const nome = decodeURIComponent(match[1]).replace(/\s+/g, " ").trim();
    return nome && !/^https?:\/\//i.test(nome) ? nome : "";
  } catch {
    return "";
  }
}

const urlsFixas = [
  { loc: `${BASE_URL}/`, changefreq: "weekly", priority: "1.0" },
  { loc: `${BASE_URL}/quem-somos`, changefreq: "monthly", priority: "0.6" },
  { loc: `${BASE_URL}/promocao`, changefreq: "weekly", priority: "0.7" },
  {
    loc: `${BASE_URL}/condicoes-de-utilizacao`,
    changefreq: "yearly",
    priority: "0.5",
  },
];

const urlsProdutos = ids.map((id) => ({
  loc: `${BASE_URL}/produto/${id}`,
  changefreq: "weekly",
  priority: "0.8",
}));

const urls = [...urlsFixas, ...urlsProdutos];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

await fs.access("./public");
await fs.writeFile(SITEMAP_PATH, xml, "utf8");

console.log(`Sitemap criado com ${urls.length} URLs.`);
console.log(`Produtos incluídos: ${urlsProdutos.length}`);
console.log(`Produtos ignorados por nome inválido: ${produtosComIdValido.length - ids.length}`);
console.log(`Domínio canónico: ${BASE_URL}`);
