import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

export default function App() {
  // 🔥 STATES
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [logged, setLogged] = useState(false);
const [showLogin, setShowLogin] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const handleLogout = () => {
  localStorage.removeItem("token");
  setLogged(false);
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

    // 🔐 GUARDAR TOKEN
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

  // 👟 TAMANHO
  const [selectedSize, setSelectedSize] = useState(null);

  // 🛒 CARRINHO
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

  // 📝 FORM
  const [form, setForm] = useState({
  name: "",
  reference: "",
  price: "",
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

  // 📦 CARREGAR PRODUTOS
  useEffect(() => {
  async function loadProducts(retry = 0) {
    try {
      const res = await fetch("https://jomabasto-backend.onrender.com/produtos");

      if (!res.ok) throw new Error("Servidor indisponível");

      const data = await res.json();

      if (Array.isArray(data)) {
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

  // 🗑️ APAGAR PRODUTO
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

  // ✏️ EDITAR PRODUTO
  const editProduct = async (product) => {
  const newName = prompt("Novo nome:", product.name);
  const newPrice = prompt("Novo preço:", product.price);
  const newImage = prompt(
    "Nova imagem URL:",
    product.images?.[0] || ""
  );
  const newDescription = prompt(
    "Nova descrição:",
    product.description || ""
  );

  if (!newName || !newPrice || !newImage) return;

  const updatedProduct = {
    ...product,
    name: newName,
    price: Number(newPrice),
    images: [newImage, ...(product.images?.slice(1) || [])],
    description: newDescription
  };

  const res = await fetch(
    `https://jomabasto-backend.onrender.com/produtos/${product._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(updatedProduct)
    }
  );

  const data = await res.json();

  console.log("PRODUTO ATUALIZADO:", data);

  setProducts((prev) =>
    prev.map((p) =>
      p._id === product._id ? data : p
    )
  );
};

  // 📸 UPLOAD IMAGEM CLOUDINARY
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

  // ➕ ADICIONAR PRODUTO
  const addProduct = async () => {
  console.log("MAIN:", form.mainCategory);
  console.log("SUB:", form.subCategory);

  if (!form.name || !form.price || !form.images[0]) {
  alert("Preencha o nome, preço e pelo menos uma imagem do produto.");
  return;
}

  const productData = {
  name: form.name,
  reference: form.reference,
  price: form.price,
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

  // 🔍 FILTRO
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

      const matchMain =
        category === "all" || mainLower === category.toLowerCase();

      const matchSub =
        !subCategory || subLower === subCategory.toLowerCase();

      const matchSearch =
  !search ||
  p.name?.toLowerCase().includes(search.toLowerCase());

return matchMain && matchSub && matchSearch;
    })
  : [];

  const addToCart = (product) => {
  if (!selectedProduct) return;

  if (!selectedSize) {
    alert("Escolhe um tamanho primeiro 👟");
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
          size: selectedSize,
          qty: 1,
        },
      ];
    }

    // 💾 GUARDAR NO LOCALSTORAGE (IMPORTANTE)
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;
  });
};

  // 💳 CHECKOUT
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
      Olá {user.name.split(" ")[0]} 👋
    </span>
  )}

  <button
  onClick={() => setSearchOpen(!searchOpen)}
  style={{
    fontSize: "22px",
    background: "none",
    border: "none",
    cursor: "pointer"
  }}
>
  🔍
</button>

  <button onClick={() => setShowFavorites(true)}>
  ❤️
</button>

  <button onClick={() => setCartOpen(true)}>
    🛒
  </button>

  {!logged ? (
    <>
      <button onClick={() => setShowLogin(true)}>
        Login
      </button>

      <button onClick={() => setShowRegister(true)}>
        Registar
      </button>
    </>
  ) : (
    <button onClick={handleLogout}>
      Logout
    </button>
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
  ☰
</button>

{mobileMenu && (
  <div className="mobile-menu">

  <details className="mobile-item">
    <summary>Homem</summary>

    <a onClick={() => setCategory("homem-running")}>Running</a>
    <a onClick={() => setCategory("homem-trail")}>Trail</a>
    <a onClick={() => setCategory("homem-futebol")}>Futebol</a>
    <a onClick={() => setCategory("homem-futsal")}>Futsal</a>
    <a onClick={() => setCategory("homem-andebol")}>Andebol</a>
    <a onClick={() => setCategory("homem-voleibol")}>Voleibol</a>
    <a onClick={() => setCategory("homem-basquetebol")}>Basquetebol</a>
    <a onClick={() => setCategory("homem-tenis")}>Ténis</a>
    <a onClick={() => setCategory("homem-padel")}>Padel</a>
    <a onClick={() => setCategory("homem-casual")}>Casual</a>
    <a onClick={() => setCategory("homem-caminhada")}>Caminhada</a>
  </details>

  <details className="mobile-item">
    <summary>Mulher</summary>

    <a onClick={() => setCategory("mulher-running")}>Running</a>
    <a onClick={() => setCategory("mulher-trail")}>Trail</a>
    <a onClick={() => setCategory("mulher-futebol")}>Futebol</a>
    <a onClick={() => setCategory("mulher-futsal")}>Futsal</a>
    <a onClick={() => setCategory("mulher-andebol")}>Andebol</a>
    <a onClick={() => setCategory("mulher-voleibol")}>Voleibol</a>
    <a onClick={() => setCategory("mulher-basquetebol")}>Basquetebol</a>
    <a onClick={() => setCategory("mulher-tenis")}>Ténis</a>
    <a onClick={() => setCategory("mulher-padel")}>Padel</a>
    <a onClick={() => setCategory("mulher-casual")}>Casual</a>
    <a onClick={() => setCategory("mulher-caminhada")}>Caminhada</a>
  </details>

  <details className="mobile-item">
    <summary>Criança</summary>

    <a onClick={() => setCategory("crianca-running")}>Running</a>
    <a onClick={() => setCategory("crianca-trail")}>Trail</a>
    <a onClick={() => setCategory("crianca-futebol")}>Futebol</a>
    <a onClick={() => setCategory("crianca-futsal")}>Futsal</a>
    <a onClick={() => setCategory("crianca-casual")}>Casual</a>
  </details>

  <details className="mobile-item">
    <summary>Acessórios</summary>

    <a onClick={() => setCategory("acessorios-bolas")}>Bolas</a>
    <a onClick={() => setCategory("acessorios-luvas")}>Luvas</a>
    <a onClick={() => setCategory("acessorios-meias")}>Meias</a>
    <a onClick={() => setCategory("acessorios-mochilas")}>Mochilas</a>
    <a onClick={() => setCategory("acessorios-bones")}>Bonés</a>
    <a onClick={() => setCategory("acessorios-trail-running")}>Trail / Running</a>
    <a onClick={() => setCategory("acessorios-verao")}>Verão</a>
    <a onClick={() => setCategory("acessorios-outros")}>Outros</a>
  </details>

  <div className="mobile-item">
    <a onClick={() => setCategory("outlet")}>Outlet</a>
  </div>

  <div className="mobile-item">
    <a onClick={() => setCategory("edicoes-especiais")}>
      Edições Especiais
    </a>
  </div>


  </div>
)}

        <nav className="nav"> {!logged ? (
  <>
    <button onClick={() => setShowLogin(true)}>
      Login
    </button>

    <button onClick={() => setShowRegister(true)}>
      Registar
    </button>
  </>
) : (
  <>
    
<span>
  Olá {user?.name?.split(" ")[0] || "Utilizador"}
</span>

<button
  onClick={handleLogout}
  style={{
    fontSize: "22px",
    background: "none",
    border: "none",
    cursor: "pointer"
  }}
>
  👤
</button>

    {/* 👑 ADMIN AQUI */}
    {isAdmin && (
      <span style={{ marginLeft: "10px", color: "red" }}>
        ADMIN
      </span>
    )}
  </>
)}

          {/* HOMEM */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Homem ▾</a>
            <div className="dropdown-menu">
              <a onClick={() => setCategory("homem-running")}>Running</a>
              <a onClick={() => setCategory("homem-trail")}>Trail</a>
              <a onClick={() => setCategory("homem-futebol")}>Futebol</a>
              <a onClick={() => setCategory("homem-futsal")}>Futsal</a>
              <a onClick={() => setCategory("homem-andebol")}>Andebol</a>
              <a onClick={() => setCategory("homem-voleibol")}>Voleibol</a>
              <a onClick={() => setCategory("homem-basquetebol")}>Basquetebol</a>
              <a onClick={() => setCategory("homem-tenis")}>Ténis</a>
              <a onClick={() => setCategory("homem-padel")}>Padel</a>
              <a onClick={() => setCategory("homem-casual")}>Casual</a>
              <a onClick={() => setCategory("homem-caminhada")}>Caminhada</a>
            </div>
          </div>

          {/* MULHER */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Mulher ▾</a>
            <div className="dropdown-menu">
              <a onClick={() => setCategory("mulher-running")}>Running</a>
              <a onClick={() => setCategory("mulher-trail")}>Trail</a>
              <a onClick={() => setCategory("mulher-futebol")}>Futebol</a>
              <a onClick={() => setCategory("mulher-futsal")}>Futsal</a>
              <a onClick={() => setCategory("mulher-andebol")}>Andebol</a>
              <a onClick={() => setCategory("mulher-voleibol")}>Voleibol</a>
              <a onClick={() => setCategory("mulher-basquetebol")}>Basquetebol</a>
              <a onClick={() => setCategory("mulher-tenis")}>Ténis</a>
              <a onClick={() => setCategory("mulher-padel")}>Padel</a>
              <a onClick={() => setCategory("mulher-casual")}>Casual</a>
              <a onClick={() => setCategory("mulher-caminhada")}>Caminhada</a>
            </div>
          </div>

          {/* CRIANÇA */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Criança ▾</a>
            <div className="dropdown-menu">
              <a onClick={() => setCategory("crianca-running")}>Running</a>
              <a onClick={() => setCategory("crianca-trail")}>Trail</a>
              <a onClick={() => setCategory("crianca-futebol")}>Futebol</a>
              <a onClick={() => setCategory("crianca-futsal")}>Futsal</a>
              <a onClick={() => setCategory("crianca-casual")}>Casual</a>
            </div>
          </div>

          {/* ACESSÓRIOS */}
          <div className="dropdown">
            <a onClick={() => setCategory("all")}>Acessórios ▾</a>
            <div className="dropdown-menu">
              <a onClick={() => setCategory("acessorios-bolas")}>Bolas</a>
              <a onClick={() => setCategory("acessorios-luvas")}>Luvas</a>
              <a onClick={() => setCategory("acessorios-meias")}>Meias</a>
              <a onClick={() => setCategory("acessorios-mochilas")}>Mochilas</a>
              <a onClick={() => setCategory("acessorios-bones")}>Bonés</a>
              <a onClick={() => setCategory("acessorios-trail-running")}>Trail/Running</a>
              <a onClick={() => setCategory("acessorios-verao")}>Verão</a>
              <a onClick={() => setCategory("acessorios-outros")}>Outros</a>
            </div>
          </div>

          {/* OUTLET */}
<a onClick={() => setCategory("outlet")}>Outlet</a>

{/* EDIÇÕES ESPECIAIS */}
<a onClick={() => setCategory("edicoes-especiais")}>
  Edições Especiais
</a>

<input
  type="text"
  placeholder="🔍 Pesquisar..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "8px 12px",
    marginLeft: "20px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    width: "220px"
  }}
/>

{/* FAVORITOS */}
<button className="cart-btn" onClick={() => setShowFavorites(true)}>
  ❤️ ({favorites.length})
</button>

          {/* CARRINHO */}
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 ({cart.length})
          </button>

        </nav>
      </header>

      {/* HERO */}
<section className="hero">
      
        <div className="overlay">
          <h2>PORTES GRÁTIS</h2>
          <p>Em compras superiores a 70 €</p>
          
        </div>
      </section>

      {/* FORM */}
      <section className="products-section">

        <h2>Coleção JomaBasto</h2>

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
  <option value="acessorios">Acessórios</option>
  <option value="outlet">Outlet</option>
  <option value="edicoes-especiais">
    Edições Especiais
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
  placeholder="Tamanhos e stock (ex: 41:5,42:3,43:0)"
  onChange={(e) =>
    setForm({
      ...form,
      sizes: e.target.value.split(",").map(item => {
        const [size, stock] = item.split(":");

        return {
          size: size.trim(),
          stock: Number(stock) || 0
        };
      })
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
    filteredProducts.map((p) => {
      console.log("A renderizar produto:", p);

      return (
        <div className="card" key={p._id}>

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

          <h3>{p.name}</h3>
          <p>{p.price} €</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px"
            }}
          >

            <button onClick={() => toggleFavorite(p)}>
              ❤️
            </button>

            {isAdmin && (
              <>
                <button onClick={() => editProduct(p)}>
                  ✏️ Editar
                </button>

                <button onClick={() => deleteProduct(p._id)}>
                  🗑️ Apagar
                </button>
              </>
            )}

          </div>

        </div>
      );
    })}
</div>

<button onClick={() => setShowFavorites(true)}>
  ❤️ ({favorites.length})
</button>

{/* FAVORITOS */}
{showFavorites && (
  <div className="cart-overlay">
    <div className="cart">
      <h2>❤️ Favoritos</h2>

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
      <h2>🛒 Carrinho</h2>

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
    🚚 Faltam {(70 - cartTotal).toFixed(2)} € para ter portes grátis.
  </p>
)}

    </div>
  </div>
)}

{/* 📸 GALERIA DO PRODUTO */}
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
        {selectedProduct.sizes?.map((item) => (
  <button
    key={item.size}
    onClick={() => setSelectedSize(item)}
    disabled={item.stock === 0}
    style={{
      padding: "8px 12px",
      borderRadius: "6px",
      border:
        selectedSize?.size === item.size
          ? "2px solid #1d4ed8"
          : "1px solid #ccc",
      background:
        item.stock === 0
          ? "#ddd"
          : selectedSize?.size === item.size
          ? "#1d4ed8"
          : "white",
      color:
        item.stock === 0
          ? "#777"
          : selectedSize?.size === item.size
          ? "white"
          : "black",
      cursor: item.stock === 0 ? "not-allowed" : "pointer",
    }}
  >
    {item.size}
    {item.stock === 0 && " (Sem stock)"}
  </button>
))}
      </div>

      {/* 🛒 BOTÃO ADICIONAR AO CARRINHO */}
      <button
        onClick={() => {
          if (!selectedSize) {
            alert("Escolhe um tamanho 👟");
            return;
          }

          addToCart({
            ...selectedProduct,
            size: selectedSize,
          });
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

      {/* 🔴 FECHAR */}
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

{/* FOOTER */}
<footer className="footer">

  <div className="footer-content">

    <div>
      <h4>JomaBasto</h4>
      <p>⭐ Revendedor Oficial Joma em Portugal</p>
    </div>

    <div>
      <p>🚚 Portes grátis em compras superiores a 70€</p>
      <p>📦 Envios por Correio Registado CTT</p>
      <p>🔄 Trocas até 30 dias</p>
      <p>🔒 Pagamentos seguros</p>
    </div>

    <div>
      <p>📧 jomabasto@sapo.pt</p>
      <p>📞 924 176 159</p>
    </div>

  </div>

  <div className="footer-bottom">
    © {new Date().getFullYear()} JomaBasto • Todos os direitos reservados.
  </div>

</footer>

</div>
);
}