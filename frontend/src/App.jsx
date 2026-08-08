import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiTruck,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiMail,
  FiPhone,
  FiMenu
} from "react-icons/fi";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Categories from "./components/Categories";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaHeart
} from "react-icons/fa";

export default function App() {
  // STATES
  const [category, setCategory] = useState(
  new URLSearchParams(window.location.search).get("categoria") || "all"
);
  const [subCategory, setSubCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const productsRef = useRef(null);
  const firstProductRef = useRef(null);

  const produtosPromocao = products.filter(
  (p) => p.promocao === true
).slice(0, 6);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [logged, setLogged] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
setLogged(false);
  setUser(null);
  setIsAdmin(false);
  setShowAccount(false);
};
const [user, setUser] = useState(null);
const [isAdmin, setIsAdmin] = useState(false);
const [showRegister, setShowRegister] = useState(false);
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

useEffect(() => {
  localStorage.removeItem("products");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token) {
    setLogged(true);
  }

  if (user) {
    setUser(user);
    setIsAdmin(user.role === "admin");
  }
}, []);

const register = async () => {
  try {
    const res = await fetch("https://jomabasto-backend.onrender.com/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: registerName,
    email: registerEmail,
    password: registerPassword,
  }),
});

    const json = await res.json();

    alert(json.message);

    if (res.ok) {
      setShowRegister(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    }

  } catch (err) {
    console.error("ERRO REGISTO:", err);
    alert("Erro no registo");
  }
};

const login = async () => {
  try {
    const res = await fetch("https://jomabasto-backend.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    console.log("LOGIN RESPOSTA:", json);

    if (!res.ok) {
      alert(json.message || "Erro no login");
      return;
    }

    // GUARDAR TOKEN
    localStorage.setItem("token", json.token);
    localStorage.setItem("user", JSON.stringify(json.user));

    setLogged(true);
    setShowLogin(false);
    setUser(json.user);
    setIsAdmin(json.user.role === "admin");

  } catch (err) {
    console.error("ERRO LOGIN:", err);
    alert("Erro no login");
  }
};

const loadOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://jomabasto-backend.onrender.com/my-orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    setOrders(data);

  } catch (err) {
    console.error("Erro encomendas:", err);
  }
};

  // TAMANHO
  const [selectedSize, setSelectedSize] = useState(null);

  // CARRINHO
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  useEffect(() => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
  const [cartOpen, setCartOpen] = useState(false);
const [mobileMenu, setMobileMenu] = useState(false);

const selectCategory = (category) => {
  setCategory(category);

  setTimeout(() => {
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

const selectMobileCategory = (category, e) => {
  selectCategory(category);

  const details = e.currentTarget.closest("details");

  if (details) {
    details.removeAttribute("open");
  }

  setMobileMenu(false);
};

  const openGallery = (product) => {
    setSelectedProduct(product);
    setActiveImage(0);
    setSelectedSize(null);
  };

  const toggleFavorite = (product) => {
  setFavorites((prev) => {
    const exists = prev.find((p) => p._id === product._id);

    if (exists) {
      return prev.filter((p) => p._id !== product._id);
    }

    return [...prev, product];
  });
};

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce(
  (total, item) => total + Number(item.price) * (item.qty || 1),
  0
);

const shippingCost = cartTotal >= 70 || cartTotal === 0 ? 0 : 5.95;

const finalTotal = cartTotal + shippingCost;

  // FORM
  const [form, setForm] = useState({
  name: "",
  reference: "",
  price: "",
  promoPrice: "",
  images: ["", "", "", ""],
  category: "homem-running",
  description: "",
  sizes: [],
  mainCategory: "",
  subCategory: ""
});
const handleSave = async () => {
  try {
    console.log(form);
    const res = await fetch("https://jomabasto-backend.onrender.com/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao guardar produto");
      return;
    }

    alert("Produto guardado!");

    console.log("PRODUTO GUARDADO:", data);

    setForm({
      name: "",
      designacao: "",
      price: "",
      images: [],
      description: "",
      sizes: []
    });

  } catch (err) {
    console.error(err);
    alert("Erro no servidor");
  }
};

  // CARREGAR PRODUTOS
  useEffect(() => {
  async function loadProducts(retry = 0) {
    try {
      const res = await fetch("https://jomabasto-backend.onrender.com/produtos");

      if (!res.ok) throw new Error("Servidor indisponível");

      const data = await res.json();

      if (Array.isArray(data)) {
        console.log("Primeiro produto:", data[0]);
setProducts(data);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.log("Tentativa", retry + 1, "falhou");

      if (retry < 5) {
        setTimeout(() => loadProducts(retry + 1), 3000);
      } else {
        setProducts([]);
      }
    }
  }

  loadProducts();
}, []);

  // APAGAR PRODUTO
const deleteProduct = async (id) => {
  if (!window.confirm("Tem a certeza que pretende apagar este produto?")) {
    return;
  }

  try {
    const res = await fetch(
      `https://jomabasto-backend.onrender.com/produtos/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      alert("Erro ao apagar o produto.");
      console.error(error);
      return;
    }

    setProducts((prev) => prev.filter((p) => p._id !== id));
  } catch (err) {
    console.error(err);
    alert("Erro de ligação ao servidor.");
  }
};

  // EDITAR PRODUTO
  const editProduct = async (product) => {
    const newName = prompt("Novo nome:", product.name);
    const newPrice = prompt("Novo Preço:", product.price);
    const newImage = prompt(
  "Nova imagem URL:",
  product.imageUrl || product.images?.[0] || ""
);
    const newDescription = prompt("Nova Descrição:", product.description);

const newPromoPrice = prompt(
  "Preço promocional (deixe vazio se Não existir):",
  product.promoPrice || ""
);

    const newSizes = prompt(
  "Tamanhos disponíveis (separados por vírgula):",
  product.sizes?.join(", ") || ""
);
console.log("TAMANHOS ESCOLHIDOS:", newSizes);

    if (!newName || !newPrice) return;

    console.log("A ENVIAR PARA BACKEND:", {
  name: newName,
  price: newPrice,
  imageUrl: newImage,
  description: newDescription,
  promoPrice: newPromoPrice
  ? Number(newPromoPrice)
  : null,
  sizes: newSizes
    ? newSizes.split(",").map(s => s.trim())
    : []
});
    
    await fetch(`https://jomabasto-backend.onrender.com/produtos/${product._id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({
  name: newName,
  price: Number(newPrice),
  imageUrl: newImage,
  description: newDescription,
  promoPrice: newPromoPrice
  ? Number(newPromoPrice)
  : null,
  sizes: newSizes
    ? newSizes.split(",").map(s => s.trim())
    : []
})
});

    setProducts(products.map(p =>
  p._id === product._id
    ? {
        ...p,
        name: newName,
        price: Number(newPrice),
        imageUrl: newImage,
        description: newDescription,
        promoPrice: newPromoPrice
  ? Number(newPromoPrice)
  : null,
        sizes: newSizes
          ? newSizes.split(",").map(s => s.trim())
          : []
      }
    : p
));
  };

  const setPromocao = async (id) => {
  try {

    const res = await fetch(
      `https://jomabasto-backend.onrender.com/promocao/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
  const erro = await res.text();
  console.log("ERRO BACKEND:", erro);
  alert("Erro ao definir PROMOÇÃO: " + erro);
  return;
}

    alert("PROMOÇÃO definida com sucesso!");

  } catch (err) {
    console.error(err);
    alert("Erro de ligação ao servidor.");
  }
};

  // UPLOAD IMAGEM CLOUDINARY
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "joma_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dboqymkjf/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    setForm({
      ...form,
      imageUrl: data.secure_url
    });
  };

  // ? ADICIONAR PRODUTO
  const addProduct = async () => {
  console.log("MAIN:", form.mainCategory);
  console.log("SUB:", form.subCategory);

  if (!form.name || !form.price || !form.images[0]) {
  alert("Preencha o nome, Preço e pelo menos uma imagem do produto.");
  return;
}

  const productData = {
  name: form.name,
  reference: form.reference,
  price: Number(form.price),
  promoPrice: form.promoPrice ? Number(form.promoPrice) : null,
  images: form.images,
  category: form.subCategory
    ? `${form.mainCategory}-${form.subCategory}`.toLowerCase()
    : form.mainCategory.toLowerCase(),
  description: form.description,
  sizes: form.sizes
};

console.log("PRODUCTO A ENVIAR:", productData);

  try {
    const res = await fetch("https://jomabasto-backend.onrender.com/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(productData)
    });

    const savedProduct = await res.json();
    console.log("STATUS:", res.status);
    console.log("RESPOSTA:", savedProduct);

    setProducts((prev) => [...prev, savedProduct]);

    setForm({
      name: "",
      reference: "",
      price: "",
      images: [],
      category: "homem-running",
      description: "",
      mainCategory: "",
      subCategory: "",
      sizes: []
    });

    setShowForm(false);

  } catch (error) {
    console.log("❌ erro ao guardar produto:", error);
  }
};

console.log("CATEGORY:", category);
console.log("SUBCATEGORY:", subCategory);

console.log("CATEGORY:", category);
console.log("SUBCATEGORY:", subCategory);

  // FILTRO
  const filteredProducts = Array.isArray(products)
  ? products.filter((p) => {
      const main =
        typeof p.category === "object"
          ? p.category?.main
          : p.category;

      const sub =
        typeof p.category === "object"
          ? p.category?.sub
          : "";

      const mainLower = (main || "").toLowerCase();
const subLower = (sub || "").toLowerCase();

const selected = category.toLowerCase();

const matchMain =
  selected === "all" ||
  (selected === "promocoes" && p.promocao === true) ||
  (selected !== "promocoes" &&
    (mainLower === selected ||
      mainLower.endsWith(`-${selected}`) ||
      subLower === selected));

const matchSub =
  !subCategory || subLower === subCategory.toLowerCase();

const matchSearch =
  !search ||
  p.name?.toLowerCase().includes(search.toLowerCase());

return matchMain && matchSub && matchSearch;
    })
  : [];

  useEffect(() => {
  if (search.trim().length < 2) return;

  if (filteredProducts.length > 0) {
    firstProductRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [search, filteredProducts]);

  const addToCart = (product) => {
  console.log("PRODUTO AO ADICIONAR:", product);
  if (!product) return;

  if (!selectedSize) {
    alert("Escolhe um tamanho primeiro");
    return;
  }

  setCart((prev) => {
    const existing = prev.find(
      (item) =>
        item._id === product._id &&
        item.size === selectedSize
    );

    let updatedCart;

    if (existing) {
      updatedCart = prev.map((item) =>
        item._id === product._id && item.size === selectedSize
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [
      ...prev,
      {
        ...product,
        price:
          product.promoPrice != null
            ? Number(product.promoPrice)
            : Number(product.price),
        size: selectedSize,
        qty: 1,
      },
    ];
    }

    // GUARDAR NO LOCALSTORAGE (IMPORTANTE)
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};

  // CHECKOUT
  const checkout = async () => {
  if (cart.length === 0) return;

  const order = {
    items: cart,
    total: cartTotal,
    user: user?.email,
    date: new Date()
  };

  try {
    const res = await fetch("https://jomabasto-backend.onrender.com/encomendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    await res.json();

    setCart([]);
    localStorage.removeItem("cart");
    setCartOpen(false);

    alert("Compra finalizada!");
  } catch (err) {
    console.log("erro checkout:", err);
  }
};

  const sizes = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

  return (
  <div
    style={{
      minHeight: "100vh",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
  
      {/* HEADER + MENU */}
      <header className="header">
        <h1 className="logo">JomaBasto Store</h1>

        <div className="mobile-actions only-mobile">

  {logged && user?.name && (
    <span className="mobile-user">
      Olá {user.name.split(" ")[0]}
    </span>
  )}

  <button
  className="icon-btn"
  onClick={() => setSearchOpen(!searchOpen)}
>
  <FiSearch size={22} />
</button>

<button
  className="icon-btn"
  onClick={() => setShowFavorites(true)}
>
  <FiHeart size={22} />

  {favorites.length > 0 && (
    <span className="badge">
      {favorites.length}
    </span>
  )}
</button>

<button
  className="icon-btn"
  onClick={() => setCartOpen(true)}
>
  <FiShoppingBag size={22} />

  {cart.length > 0 && (
    <span className="badge">
      {cart.length}
    </span>
  )}
</button>

  {!logged ? (
  <button
    className="icon-btn"
    onClick={() => setShowLogin(true)}
  >
    <FiUser size={22} />
  </button>
) : (
  <details className="mobile-user-menu">
    <summary className="icon-btn">
      <FiUser size={22} />
    </summary>

    <div className="mobile-user-dropdown">
      <span>
        Olá {user?.name?.split(" ")[0]} 
      </span>

      <button
  onClick={() => {
    setShowAccount(true);
    loadOrders();
  }}
>
  Minha Conta
</button>

<button
  onClick={handleLogout}
>
  Terminar sessão
</button>
    </div>
  </details>
)}

</div>

{searchOpen && (
  <div className="mobile-search">
    <input
      type="text"
      placeholder="Pesquisar..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        marginTop: "10px"
      }}
    />
  </div>
)}
        
        <button
  className="mobile-menu-btn"
  onClick={() => setMobileMenu(!mobileMenu)}
>
  <FiMenu />
</button>

{mobileMenu && (
  <div className="mobile-menu">

  <details className="mobile-item">
    <summary>Homem</summary>

    <a onClick={(e) => selectMobileCategory("homem-running", e)}>Running</a>
    <a onClick={(e) => selectMobileCategory("homem-trail", e)}>Trail</a>
    <a onClick={(e) => selectMobileCategory("homem-futebol", e)}>Futebol</a>
    <a onClick={(e) => selectMobileCategory("homem-futsal", e)}>Futsal</a>
    <a onClick={(e) => selectMobileCategory("homem-andebol", e)}>Andebol</a>
    <a onClick={(e) => selectMobileCategory("homem-voleibol", e)}>Voleibol</a>
    <a onClick={(e) => selectMobileCategory("homem-basquetebol", e)}>Basquetebol</a>
    <a onClick={(e) => selectMobileCategory("homem-tenis", e)}>Ténis</a>
    <a onClick={(e) => selectMobileCategory("homem-padel", e)}>Padel</a>
    <a onClick={(e) => selectMobileCategory("homem-casual", e)}>Casual</a>
    <a onClick={(e) => selectMobileCategory("homem-caminhada", e)}>Caminhada</a>
  </details>

  <details className="mobile-item">
    <summary>Mulher</summary>

    <a onClick={(e) => selectMobileCategory("mulher-running", e)}>Running</a>
    <a onClick={(e) => selectMobileCategory("mulher-trail", e)}>Trail</a>
    <a onClick={(e) => selectMobileCategory("mulher-futebol", e)}>Futebol</a>
    <a onClick={(e) => selectMobileCategory("mulher-futsal", e)}>Futsal</a>
    <a onClick={(e) => selectMobileCategory("mulher-andebol", e)}>Andebol</a>
    <a onClick={(e) => selectMobileCategory("mulher-voleibol", e)}>Voleibol</a>
    <a onClick={(e) => selectMobileCategory("mulher-basquetebol", e)}>Basquetebol</a>
    <a onClick={(e) => selectMobileCategory("mulher-tenis", e)}>Ténis</a>
    <a onClick={(e) => selectMobileCategory("mulher-padel", e)}>Padel</a>
    <a onClick={(e) => selectMobileCategory("mulher-casual", e)}>Casual</a>
    <a onClick={(e) => selectMobileCategory("mulher-caminhada", e)}>Caminhada</a>
  </details>

  <details className="mobile-item">
    <summary>Criança</summary>

    <a onClick={(e) => selectMobileCategory("crianca-running", e)}>Running</a>
    <a onClick={(e) => selectMobileCategory("crianca-trail", e)}>Trail</a>
    <a onClick={(e) => selectMobileCategory("crianca-futebol", e)}>Futebol</a>
    <a onClick={(e) => selectMobileCategory("crianca-futsal", e)}>Futsal</a>
    <a onClick={(e) => selectMobileCategory("crianca-casual", e)}>Casual</a>
  </details>

  <details className="mobile-item">
    <summary>ACESSÓRIOS</summary>

    <a onClick={(e) => selectMobileCategory("acessorios-bolas", e)}>Bolas</a>
    <a onClick={(e) => selectMobileCategory("acessorios-luvas", e)}>Luvas</a>
    <a onClick={(e) => selectMobileCategory("acessorios-meias", e)}>Meias</a>
    <a onClick={(e) => selectMobileCategory("acessorios-mochilas", e)}>Mochilas</a>
    <a onClick={(e) => selectMobileCategory("acessorios-bones", e)}>Bonés</a>
    <a onClick={(e) => selectMobileCategory("acessorios-trail-running", e)}>Trail / Running</a>
    <a onClick={(e) => selectMobileCategory("acessorios-verao", e)}>Verão</a>
    <a onClick={(e) => selectMobileCategory("acessorios-outros", e)}>Outros</a>
  </details>

    <details className="mobile-item">
    <summary>Têxtil</summary>

    <a onClick={(e) => selectMobileCategory("textil-homem", e)}>Homem</a>
    <a onClick={(e) => selectMobileCategory("textil-mulher", e)}>Mulher</a>
    <a onClick={(e) => selectMobileCategory("textil-crianca", e)}>Criança</a>
    <a onClick={(e) => selectMobileCategory("textil-outlet", e)}>Outlet</a>
  </details>

  <div className="mobile-item">
    <a onClick={(e) => selectMobileCategory("outlet", e)}>Outlet</a>
  </div>

  <div className="mobile-item">
    <a onClick={(e) => selectMobileCategory("edicoes-especiais", e)}>
      EDIÇÕES Especiais
    </a>
  </div>


  </div>
)}

        <nav className="nav"> 
          {!logged ? (
  <button
    className="icon-btn"
    onClick={() => setShowLogin(true)}
  >
    <FiUser size={22} />
  </button>
) : (
  <>
    <span className="desktop-user">
      Olá {user?.name?.split(" ")[0]}
    </span>

    <button
  className="icon-btn"
  onClick={() => setShowAccount(true)}
>
  <FiUser size={22} />
</button>

    {/* ADMIN AQUI */}
    {isAdmin && (
      <span style={{ marginLeft: "10px", color: "red" }}>
        ADMIN
      </span>
    )}
  </>
)}

          {/* HOMEM */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Homem</a>
            <div className="dropdown-menu">
              <a onClick={() => selectCategory("homem-running")}>Running</a>
              <a onClick={() => selectCategory("homem-trail")}>Trail</a>
              <a onClick={() => selectCategory("homem-futebol")}>Futebol</a>
              <a onClick={() => selectCategory("homem-futsal")}>Futsal</a>
              <a onClick={() => selectCategory("homem-andebol")}>Andebol</a>
              <a onClick={() => selectCategory("homem-voleibol")}>Voleibol</a>
              <a onClick={() => selectCategory("homem-basquetebol")}>Basquetebol</a>
              <a onClick={() => selectCategory("homem-tenis")}>Ténis</a>
              <a onClick={() => selectCategory("homem-padel")}>Padel</a>
              <a onClick={() => selectCategory("homem-casual")}>Casual</a>
              <a onClick={() => selectCategory("homem-caminhada")}>Caminhada</a>
            </div>
          </div>

          {/* MULHER */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Mulher</a>
            <div className="dropdown-menu">
              <a onClick={() => selectCategory("mulher-running")}>Running</a>
              <a onClick={() => selectCategory("mulher-trail")}>Trail</a>
              <a onClick={() => selectCategory("mulher-futebol")}>Futebol</a>
              <a onClick={() => selectCategory("mulher-futsal")}>Futsal</a>
              <a onClick={() => selectCategory("mulher-andebol")}>Andebol</a>
              <a onClick={() => selectCategory("mulher-voleibol")}>Voleibol</a>
              <a onClick={() => selectCategory("mulher-basquetebol")}>Basquetebol</a>
              <a onClick={() => selectCategory("mulher-tenis")}>Ténis</a>
              <a onClick={() => selectCategory("mulher-padel")}>Padel</a>
              <a onClick={() => selectCategory("mulher-casual")}>Casual</a>
              <a onClick={() => selectCategory("mulher-caminhada")}>Caminhada</a>
            </div>
          </div>

          {/* Criança */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Criança</a>
            <div className="dropdown-menu">
              <a onClick={() => selectCategory("crianca-running")}>Running</a>
              <a onClick={() => selectCategory("crianca-trail")}>Trail</a>
              <a onClick={() => selectCategory("crianca-futebol")}>Futebol</a>
              <a onClick={() => selectCategory("crianca-futsal")}>Futsal</a>
              <a onClick={() => selectCategory("crianca-casual")}>Casual</a>
            </div>
          </div>

          {/* ACESSÓRIOS */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>ACESSÓRIOS</a>
            <div className="dropdown-menu">
              <a onClick={() => selectCategory("acessorios-bolas")}>Bolas</a>
              <a onClick={() => selectCategory("acessorios-luvas")}>Luvas</a>
              <a onClick={() => selectCategory("acessorios-meias")}>Meias</a>
              <a onClick={() => selectCategory("acessorios-mochilas")}>Mochilas</a>
              <a onClick={() => selectCategory("acessorios-bones")}>Bonés</a>
              <a onClick={() => selectCategory("acessorios-trail-running")}>Trail/Running</a>
              <a onClick={() => selectCategory("acessorios-verao")}>Verão</a>
              <a onClick={() => selectCategory("acessorios-outros")}>Outros</a>
            </div>
          </div>

          {/* Têxtil */}
<div className="dropdown">
  <a onClick={() => setCategory("all")}>Têxtil</a>
  <div className="dropdown-menu">
    <a onClick={() => selectCategory("textil-homem")}>Homem</a>
    <a onClick={() => selectCategory("textil-mulher")}>Mulher</a>
    <a onClick={() => selectCategory("textil-crianca")}>Criança</a>
    <a onClick={() => selectCategory("textil-outlet")}>Outlet</a>
  </div>
</div>

          {/* OUTLET */}
<a onClick={() => selectCategory("outlet")}>Outlet</a>

{/* EDIÇÕES ESPECIAIS */}
<a onClick={() => selectCategory("edicoes-especiais")}>
  EDIÇÕES Especiais
</a>

<div className="search-box">
  <FiSearch className="search-icon" />

  <input
    type="text"
    placeholder="Pesquisar produtos..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-input"
  />
</div>

{/* FAVORITOS */}
<button className="icon-btn" onClick={() => setShowFavorites(true)}>
  <FiHeart size={22} />
  {favorites.length > 0 && (
    <span className="badge">{favorites.length}</span>
  )}
</button>

          {/* CARRINHO */}
          <button className="icon-btn" onClick={() => setCartOpen(true)}>
  <FiShoppingBag size={22} />
  {cart.length > 0 && (
    <span className="badge">{cart.length}</span>
  )}
</button>

        </nav>
      </header>

      {/* HERO */}
<section className="hero">
  <img src="/images/hero-trail.png" alt="Trail" />
</section>


  <section id="ofertas" className="promocoes-container">

<section className="seo-home">
  <div className="seo-home-container">

    <h2>Loja Oficial JomaBasto em Portugal</h2>

    <p>
      A <strong>JomaBasto Store</strong> é revendedora oficial da
      <strong> Joma</strong> em Portugal, especializada em
      <strong> sapatilhas</strong>,
      <strong> Vestuário desportivo</strong> e
      <strong> ACESSÓRIOS</strong> para
      <strong> corrida</strong>,
      <strong> trail running</strong>,
      <strong> futebol</strong>,
      <strong> futsal</strong>,
      <strong> padel</strong> e
      <strong> fitness</strong>.
    </p>

    <p>
      Descobre uma seleção de produtos originais Joma com envio rápido para todo
      Portugal, pagamentos seguros, trocas simples e apoio especializado para
      atletas, clubes e apaixonados pelo desporto.
    </p>

  </div>
</section>

  </section>
)


  <Categories
    onSelect={(sport) => {
      setCategory(sport);
      setSubCategory("");

      setTimeout(() => {
        productsRef.current?.scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    }}
  />


{/* FORM */}
     <section ref={productsRef} className="products-section">

        {isAdmin && (
  <button onClick={() => setShowForm(!showForm)}>
    {showForm ? "Fechar" : "+ Adicionar Produto"}
  </button>
)}


        {showForm && (
          <div className="form">

            <input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
  placeholder="Referência"
  value={form.reference}
  onChange={(e) =>
    setForm({ ...form, reference: e.target.value })
  }
/>

            <input
              placeholder="Preço"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

<input
  type="number"
  placeholder="Preço PROMOÇÃO (opcional)"
  value={form.promoPrice || ""}
  onChange={(e) =>
    setForm({
      ...form,
      promoPrice: e.target.value
    })
  }
/>

<select
  value={form.mainCategory}
  onChange={(e) =>
    setForm({ ...form, mainCategory: e.target.value, subCategory: "" })
  }
></select>

            <select
  value={form.mainCategory}
  onChange={(e) =>
    setForm({ ...form, mainCategory: e.target.value, subCategory: "" })
  }
>
  <option value="">Categoria principal</option>
  <option value="homem">Homem</option>
  <option value="mulher">Mulher</option>
  <option value="crianca">Criança</option>
  <option value="acessorios">ACESSÓRIOS</option>
  <option value="textil">Têxtil</option>
  <option value="outlet">Outlet</option>
  <option value="edicoes-especiais">
    EDIÇÕES Especiais
  </option>
</select>
{form.mainCategory && (
  <select
    value={form.subCategory}
    onChange={(e) =>
      setForm({ ...form, subCategory: e.target.value })
    }
  >
    <option value="">Subcategoria</option>

    {form.mainCategory === "homem" && (
      <>
        <option value="running">Running</option>
        <option value="trail">Trail</option>
        <option value="futebol">Futebol</option>
        <option value="futsal">Futsal</option>
        <option value="andebol">Andebol</option>
        <option value="voleibol">Voleibol</option>
        <option value="basquetebol">Basquetebol</option>
        <option value="tenis">Ténis</option>
        <option value="padel">Padel</option>
        <option value="casual">Casual</option>
        <option value="caminhada">Caminhada</option>
      </>
    )}

    {form.mainCategory === "mulher" && (
      <>
        <option value="running">Running</option>
        <option value="trail">Trail</option>
        <option value="futebol">Futebol</option>
        <option value="casual">Casual</option>
        <option value="caminhada">Caminhada</option>
        <option value="futsal">Futsal</option>
        <option value="andebol">Andebol</option>
        <option value="voleibol">Voleibol</option>
        <option value="basquetebol">Basquetebol</option>
        <option value="tenis">Ténis</option>
        <option value="padel">Padel</option>
      </>
    )}

    {form.mainCategory === "crianca" && (
      <>
        <option value="running">Running</option>
        <option value="trail">Trail</option>
        <option value="Futsal">Futsal</option>
        <option value="futebol">Futebol</option>
        <option value="casual">Casual</option>
      </>
    )}

    {form.mainCategory === "acessorios" && (
      <>
        <option value="bolas">Bolas</option>
        <option value="luvas">Luvas</option>
        <option value="meias">Meias</option>
        <option value="mochilas">Mochilas</option>
        <option value="bones">Bonés</option>
        <option value="trail-running">Trail/Running</option>
        <option value="verao">Verão</option>
        <option value="outros">Outros</option>
      </>
    )}

    {form.mainCategory === "textil" && (
      <>
        <option value="homem">Homem</option>
        <option value="mulher">Mulher</option>
        <option value="crianca">Criança</option>
        <option value="outlet">Outlet</option>
      </>
    )}

  </select>
)}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <input
  placeholder="Imagem 1 URL"
  onChange={(e) =>
    setForm({
      ...form,
      images: [
        e.target.value,
        form.images[1],
        form.images[2],
        form.images[3]
      ]
    })
  }
/>

<input
  placeholder="Imagem 2 URL"
  onChange={(e) =>
    setForm({
      ...form,
      images: [
        form.images[0],
        e.target.value,
        form.images[2],
        form.images[3]
      ]
    })
  }
/>

<input
  placeholder="Imagem 3 URL"
  onChange={(e) =>
    setForm({
      ...form,
      images: [
        form.images[0],
        form.images[1],
        e.target.value,
        form.images[3]
      ]
    })
  }
/>

<input
  placeholder="Imagem 4 URL"
  onChange={(e) =>
    setForm({
      ...form,
      images: [
        form.images[0],
        form.images[1],
        form.images[2],
        e.target.value
      ]
    })
  }
/>

            <textarea
              placeholder="Descrição"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              placeholder="Tamanhos (35,36,37)"
              onChange={(e) =>
                setForm({
                  ...form,
                  sizes: e.target.value.split(",")
                })
              }
            />

            <button onClick={addProduct}>
  Guardar Produto
</button>

          </div>
        )}
</section>
        {/* PRODUTOS */}
      
        <div className="products-grid">
  {Array.isArray(filteredProducts) &&
    filteredProducts.map((p, index) => {

      return (
        <div
  className="card"
  key={p._id}
  ref={index === 0 ? firstProductRef : null}
>

          {/* IMAGEM PRINCIPAL APENAS */}
          <img
  src={p.images?.[0]}
  alt={p.name}
  onClick={() => openGallery(p)}
  style={{
    cursor: "pointer",
    width: "160px",
    height: "160px",
    maxWidth: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    display: "block",
    margin: "0 auto"
  }}
/>
          <div className="product-header">
  <h3>{p.name}</h3>

  {!p.promocao && (
    <span className="price-inline">
      {p.price} €
    </span>
  )}
</div>

<div className="product-price">

  {p.promoPrice ? (
    <>
      <p className="old-price">
        {p.price} €
      </p>

      <p className="promo-price">
        {p.promoPrice} €
      </p>

      <span className="discount-badge">
        🔥 -
        {Math.round(
          ((p.price - p.promoPrice) / p.price) * 100
        )}
        %
      </span>
    </>
  ) : null}

</div>

<div className="stock-favorite">

  <span className="stock-ok">
    ✓ Em stock
  </span>

  <button onClick={() => toggleFavorite(p)} className="favorite-btn">
    <FaHeart />
  </button>

</div>


{isAdmin && (
  <div className="product-actions">

    <button onClick={() => editProduct(p)}>
      Editar
    </button>

    <button onClick={() => setPromocao(p._id)}>
      {p.promocao ? "❌ Remover PROMOÇÃO" : "🔥 PROMOÇÃO"}
    </button>

    <button onClick={() => deleteProduct(p._id)}>
      Apagar
    </button>

  </div>
)}

        </div>
      );
    })}
</div>

<button onClick={() => setShowFavorites(true)}>
  Favoritos ({favorites.length})
</button>

{/* FAVORITOS */}
{showFavorites && (
  <div className="cart-overlay">
    <div className="cart">
      <h2>Favoritos</h2>

      <button onClick={() => setShowFavorites(false)}>
        Fechar
      </button>

      {favorites.length === 0 && (
        <p>Sem favoritos</p>
      )}

      {favorites.map((item) => (
  <div key={item._id} style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
    
    <img
      src={item.images?.[0]}
      alt={item.name}
      style={{
        width: "80px",
        height: "80px",
        objectFit: "cover",
        borderRadius: "8px"
      }}
    />

    <div className="cart-info">
  <p>{item.name}</p>
  <p>{item.price} €</p>
</div>

  </div>
))}
    </div>
  </div>
)}

      {/* CARRINHO */}
      {cartOpen && (
  <div className="cart-overlay">
    <div className="cart">
      <h2>Carrinho</h2>

      <button onClick={() => setCartOpen(false)}>
        Fechar
      </button>

      <button
  onClick={() => {
    setCartOpen(false);
    window.location.href = "/checkout";
  }}
>
  Finalizar Compra
</button>

      {cart.length === 0 && <p>Carrinho vazio</p>}

      {cart.map((item, index) => (
  <div key={index} className="cart-item">

    <p>{item.name}</p>
    <p>{item.price} €</p>

    <p>Tamanho: {item.size}</p>
    <p>Quantidade: {item.qty || 1}</p>

    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      
      <button
        onClick={() => {
          setCart((prev) =>
            prev.map((p, i) =>
              i === index && (p.qty || 1) > 1
                ? { ...p, qty: p.qty - 1 }
                : p
            )
          );
        }}
      >
        -
      </button>

      <span>{item.qty || 1}</span>

      <button
        onClick={() => {
          setCart((prev) =>
            prev.map((p, i) =>
              i === index
                ? { ...p, qty: (p.qty || 1) + 1 }
                : p
            )
          );
        }}
      >
        +
      </button>

    </div>

    <button onClick={() => removeFromCart(index)}>
      Remover
    </button>

  </div>
))}

      <hr style={{ margin: "20px 0" }} />

<p>
  <strong>Subtotal:</strong> {cartTotal.toFixed(2)} €
</p>

<p>
  <strong>Portes:</strong>{" "}
  {shippingCost === 0 ? (
    <span style={{ color: "green" }}>Grátis</span>
  ) : (
    `${shippingCost.toFixed(2)} €`
  )}
</p>

<h3>Total: {finalTotal.toFixed(2)} €</h3>

{cartTotal < 70 && cartTotal > 0 && (
  <p style={{ color: "#e30613", fontSize: "14px" }}>
    Faltam {(70 - cartTotal).toFixed(2)} € para ter portes Grátis.
  </p>
)}

    </div>
  </div>
)}

{/* GALERIA DO PRODUTO */}
{selectedProduct && (
  <div
    className="cart-overlay"
    onClick={() => {
      setSelectedProduct(null);
      setSelectedSize(null);
    }}
  >
    <div
      className="cart"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "90%",
        maxWidth: "900px",
      }}
    >
      <h2>{selectedProduct.name}</h2>

{selectedProduct.reference && (
  <p
    style={{
      fontSize: "14px",
      margin: "5px 0 15px",
      color: "#666",
    }}
  >
    Referência: {selectedProduct.reference}
  </p>
)}

<p
  style={{
    fontSize: "16px",
    margin: "15px 0",
    lineHeight: "1.5",
    color: "#444",
  }}
>
  {selectedProduct.description}
</p>

      <h3 style={{ marginTop: "10px" }}>Tamanhos</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {selectedProduct.sizes?.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border:
                selectedSize === size
                  ? "2px solid #1d4ed8"
                  : "1px solid #ccc",
              background: selectedSize === size ? "#1d4ed8" : "white",
              color: selectedSize === size ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {size}
          </button>
        ))}
      </div>

      {/* IMAGEM GRANDE */}
      <img
        src={selectedProduct?.images?.[activeImage]}
        alt=""
        style={{
          width: "100%",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      />

      {/* MINIATURAS */}
      <div className="gallery">
        {selectedProduct?.images?.map((img, i) => (
          <img
            key={i}
            src={img}
            className="gallery-image"
            alt=""
            onClick={() => setActiveImage(i)}
            style={{
              cursor: "pointer",
              opacity: activeImage === i ? 1 : 0.6,
              border:
                activeImage === i
                  ? "2px solid #1d4ed8"
                  : "none",
            }}
          />
        ))}
      </div>

      {/* BOTÃO ADICIONAR AO CARRINHO */}
      <button
        onClick={() => {
          if (!selectedSize) {
            alert("Escolhe um tamanho");
            return;
          }

          addToCart({
  ...selectedProduct,
  size: selectedSize,
});

setSelectedProduct(null);
setSelectedSize(null);
        }}
        style={{
          marginTop: "15px",
          padding: "10px 15px",
          border: "none",
          background: "#1d4ed8",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Adicionar ao carrinho
      </button>

      {/* BOTÃO WHATSAPP */}
<button
  onClick={() => {
    const mensagem = `Olá, gostaria de saber se têm disponível o produto ${selectedProduct.name}.
${selectedProduct.reference ? `Referência: ${selectedProduct.reference}` : ""}
${selectedSize ? `Tamanho: ${selectedSize}` : ""}`;

    window.open(
      `https://wa.me/351924176159?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }}
  style={{
    marginTop: "10px",
    padding: "10px 15px",
    border: "none",
    background: "#25D366",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  }}
>
  Perguntar no WhatsApp
</button>

      {/* FECHAR */}
      <button
        onClick={() => {
          setSelectedProduct(null);
          setSelectedSize(null);
        }}
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          border: "none",
          background: "#444",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Fechar
      </button>
    </div>
  </div>
)}
{showLogin && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
      
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>

      <button
  onClick={() => {
    setShowLogin(false);
    setShowRegister(true);
  }}
>
  Criar conta
</button>

      <button onClick={() => setShowLogin(false)}>
        Fechar
      </button>

    </div>
  </div>
)}

{showRegister && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>

      <h2>Registar</h2>

      <input
        placeholder="Nome"
        value={registerName}
        onChange={(e) => setRegisterName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
      />

      <button onClick={register}>
        Criar conta
      </button>

      <button onClick={() => setShowRegister(false)}>
        Fechar
      </button>

    </div>
  </div>
)}

<section className="faq-home">

  <h2>Perguntas Frequentes</h2>

  <div className="faq-item">
    <h3>Os produtos Joma são originais?</h3>
    <p>
      Sim. A JomaBasto Store é revendedora oficial da Joma em Portugal e
      comercializa exclusivamente produtos originais da marca.
    </p>
  </div>

  <div className="faq-item">
    <h3>Quanto tempo demora a entrega?</h3>
    <p>
      As encomendas são expedidas rapidamente através dos CTT, com entrega
      normalmente entre 3 e 5 dias úteis em Portugal Continental.
    </p>
  </div>

  <div className="faq-item">
    <h3>Posso trocar ou devolver um artigo?</h3>
    <p>
      Sim. Dispõe de até 15 dias para solicitar a troca ou devolução, de
      acordo com a nossa pOlática de trocas.
    </p>
  </div>

  <div className="faq-item">
    <h3>Os portes são gratuitos?</h3>
    <p>
      Sim. Os portes são gratuitos para encomendas superiores a 70 €.
    </p>
  </div>

</section>

{/* FOOTER */}
<footer className="footer">

  <div className="footer-content">

    <div className="footer-block footer-brand">
  <img
    src="/jomabasto.png"
    alt="JomaBasto"
    className="footer-logo"
  />

  <p>Revendedor Oficial Joma em Portugal</p>
</div>

    <div className="footer-block">
  <FiTruck size={28} />
  <h5>Portes</h5>
  <p>Grátis acima de 70 €</p>
</div>

<div className="footer-block">
  <FiPackage size={28} />
  <h5>Envios</h5>
  <p>Correio Registado CTT</p>
</div>

<div className="footer-block">
  <FiRefreshCw size={28} />
  <h5>Trocas</h5>
  <p>até 15 dias</p>
</div>

<div className="footer-block">
  <FiShield size={28} />
  <h5>Pagamentos</h5>
  <p>100% Seguros</p>
</div>

<div className="footer-block">
  <FiMail size={22} />

  <a
    href="mailto:jomabasto@sapo.pt"
    className="footer-contact"
  >
    jomabasto@sapo.pt
  </a>

  <FiPhone
    size={22}
    style={{ marginTop: "12px" }}
  />

  <a
    href="tel:+351924176159"
    className="footer-contact"
  >
    924 176 159
  </a>
</div>

  </div>

  <div className="footer-bottom">
    <span>€ {new Date().getFullYear()} JomaBasto</span>

    <div className="footer-links">
      <a href="/quem-somos">Quem Somos</a>
  <a href="#">Termos</a>
  <a href="#">Privacidade</a>
</div>

<div className="footer-social">

  <span>Segue-nos</span>

  <a
    href="https://facebook.com/jomabasto"
    target="_blank"
    rel="noreferrer"
  >
    <FaFacebookF />
  </a>

  <a
    href="https://instagram.com/jomabasto"
    target="_blank"
    rel="noreferrer"
  >
    <FaInstagram />
  </a>

  <a
    href="https://youtube.com/jomabasto"
    target="_blank"
    rel="noreferrer"
  >
    <FaYoutube />
  </a>

  <a
    href="https://tiktok.com/@jomabasto"
    target="_blank"
    rel="noreferrer"
  >
    <FaTiktok />
  </a>

</div>

</div>

</footer>

{showAccount && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >

    <div
      style={{
        background:"#fff",
        padding:"30px",
        borderRadius:"12px",
        width:"90%",
        maxWidth:"500px"
      }}
    >

      <h2>A Minha Conta</h2>

      <p>
        <b>Nome:</b> {user?.name}
      </p>

      <p>
        <b>Email:</b> {user?.email}
      </p>

      <hr />

      <h3>As minhas encomendas</h3>

      <div
  style={{
    maxHeight: "250px",
    overflowY: "auto",
    marginTop: "10px"
  }}
>
{orders.length === 0 ? (
  <p>Ainda Não existem encomendas.</p>
) : (
  orders.map((order)=>(
    <div
      key={order._id}
      style={{
        borderBottom: "1px solid #ddd",
        padding: "10px 0"
      }}
    >
      Encomenda #{order._id}
      <br/>
      Estado: {order.estado}
    </div>
  ))
)}
</div>

      <button
        onClick={() => setShowAccount(false)}
      >
        Fechar
      </button>

      <button
        onClick={handleLogout}
      >
        Terminar sessão
      </button>

    </div>

  </div>
)}

</div>
);
}






















