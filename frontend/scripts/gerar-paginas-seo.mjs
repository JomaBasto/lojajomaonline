import fs from "node:fs/promises";
import path from "node:path";

const API_URL = "https://jomabasto-backend.onrender.com/produtos";
const BASE_URL = "https://www.jomabasto.com";

const distIndex = path.resolve("dist/index.html");

let response;
let ultimoErro;

for (let tentativa = 1; tentativa <= 3; tentativa++) {
  try {
    response = await fetch(API_URL);
    if (response.ok) break;
    ultimoErro = new Error(`Erro ao carregar produtos: ${response.status}`);
  } catch (erro) {
    ultimoErro = erro;
  }

  if (tentativa < 3) {
    console.warn(`Tentativa ${tentativa} falhou; nova tentativa em ${tentativa * 2}s.`);
    await new Promise((resolve) => setTimeout(resolve, tentativa * 2000));
  }
}

if (!response?.ok) {
  throw new Error(
    `Failed to load products after 3 attempts: ${ultimoErro?.message ?? "unknown error"}`,
    { cause: ultimoErro }
  );
}

const produtos = await response.json();
let template = await fs.readFile(distIndex, "utf8");

let criados = 0;

for (const produto of produtos) {
  if (!/^[a-f0-9]{24}$/i.test(String(produto?._id ?? "")) || !produto?.name) continue;

  const id = produto._id;
  const nomeOriginal = String(produto.name || "").trim();
  let nome = nomeOriginal;

  if (/^https?:\/\//i.test(nomeOriginal)) {
    const match = nomeOriginal.match(/-,([^,]+),-TABELA/i);

    if (match) {
      try {
        nome = decodeURIComponent(match[1]).replace(/\s+/g, " ").trim();
      } catch {
        nome = "";
      }
    } else {
      nome = "";
    }
  }

  if (!nome || /^https?:\/\//i.test(nome)) {
    console.warn(`Produto ignorado por nome inválido: ${id}`);
    continue;
  }
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

  const image = produto.reference === "AGUW2604AG" ? "https://res.cloudinary.com/dboqymkjf/image/upload/v1791966424/AGUW2604AG.jpg" : produto.images?.[0] || `${BASE_URL}/jomabasto.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nome,
    image: produto.reference === "AGUW2604AG" ? [image] : (produto.images || [image]),
    description: produto.description || description,
    sku: produto.reference || undefined,
    mpn: produto.reference || undefined,
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
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PT",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "5.95",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PT",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
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

  const productSchemaScript =
    `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;

  // Preservar o schema Organization do index.html e acrescentar o schema Product.
  html = html.replace(
    "</head>",
    `  ${productSchemaScript}\n</head>`
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




