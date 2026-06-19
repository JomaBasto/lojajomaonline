import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

export default function App() {
  // 🔥 STATES
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [logged, setLogged] = useState(
  !!localStorage.getItem("token")
);
const [showLogin, setShowLogin] = useState(false);
  const [category, setCategory] = useState("all");
  const [activeImage, setActiveImage] = useState(0);
  const handleLogout = () => {
  localStorage.removeItem("token");
  setLogged(false);
};
const [user, setUser] = useState(null);
const [isAdmin, setIsAdmin] = useState(false);
const [showRegister, setShowRegister] = useState(false);

  // 👟 TAMANHO
  const [selectedSize, setSelectedSize] = useState(null);

  // 🛒 CARRINHO
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const openGallery = (product) => {
    setSelectedProduct(product);
    setActiveImage(0);
    setSelectedSize(null);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce(
  (total, item) => total + Number(item.price) * (item.qty || 1),
  0
);

  // 📝 FORM
  const [form, setForm] = useState({
  name: "",
  price: "",
  images: ["", "", "", ""],
  category: "homem-running",
  description: "",
  sizes: []
});

  // 📦 CARREGAR PRODUTOS
  useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch("https://lojajomaonline-1.onrender.com/produtos");

      if (!res.ok) {
        console.log("Erro HTTP:", res.status);
        setProducts([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.log("Resposta inválida:", data);
        setProducts([]);
      }

    } catch (err) {
      console.log("Erro ao carregar produtos:", err);
      setProducts([]);
    }
  }

  loadProducts();
}, []);

  // 🗑️ APAGAR PRODUTO
  const deleteProduct = async (id) => {
  await fetch(`https://lojajomaonline-1.onrender.com/produtos/${id}`, {
    method: "DELETE",
  });

  setProducts(products.filter(p => p._id !== id));
};

  // ✏️ EDITAR PRODUTO
  const editProduct = async (product) => {
    const newName = prompt("Novo nome:", product.name);
    const newPrice = prompt("Novo preço:", product.price);
    const newImage = prompt("Nova imagem URL:", product.imageUrl);
    const newDescription = prompt("Nova descrição:", product.description);

    if (!newName || !newPrice || !newImage) return;

    await fetch(`https://lojajomaonline-1.onrender.com/produtos/${product._id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: newName,
    price: newPrice,
    imageUrl: newImage,
    description: newDescription
  })
});

    setProducts(products.map(p =>
      p._id === product._id
        ? {
            ...p,
            name: newName,
            price: newPrice,
            imageUrl: newImage,
            description: newDescription
          }
        : p
    ));
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
    if (!form.name || !form.price || !form.images[0]) return;

    const productData = {
      name: form.name,
      price: form.price,
      images: form.images,
      category: form.category,
      description: form.description,
      sizes: form.sizes
    };

    try {
      const res = await fetch("https://lojajomaonline-1.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });

      const savedProduct = await res.json();

      setProducts((prev) => [...prev, savedProduct]);

      setForm({
        name: "",
        price: "",
        images: "",
        category: "homem-running",
        description: "",
        sizes: []
      });

      setShowForm(false);

    } catch (error) {
      console.log("❌ erro ao guardar produto:", error);
    }
  };

  // 🔍 FILTRO
  const filteredProducts = Array.isArray(products)
  ? products.filter((p) => {
      if (category === "all") return true;
      return p.category === category;
    })
  : [];

  // 🛒 ADD TO CART
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

    if (existing) {
      return prev.map((item) =>
        item._id === product._id && item.size === selectedSize
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        ...product,
        size: selectedSize,
        qty: 1
      }
    ];
  });
};

  // 💳 CHECKOUT
  const checkout = async () => {
    if (cart.length === 0) return;

    const order = {
      items: cart,
      total: cartTotal
    };

    try {
      const res = await fetch("https://lojajomaonline-1.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      await res.json();

      setCart([]);
      setCartOpen(false);

      alert("Compra finalizada com sucesso!");
    } catch (err) {
      console.log("❌ erro checkout:", err);
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
    <span style={{ marginRight: "10px" }}>
      Olá, {user?.name || "Utilizador"}
    </span>

    <button onClick={logout}>
      Logout
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
              <a onClick={() => setCategory("acessorios-trail")}>Trail/Running</a>
              <a onClick={() => setCategory("acessorios-verao")}>Verão</a>
              <a onClick={() => setCategory("acessorios-outros")}>Outros</a>
            </div>
          </div>

          {/* OUTLET */}
          <a onClick={() => setCategory("all")}>Outlet</a>

          {/* CARRINHO */}
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 ({cart.length})
          </button>

        </nav>
      </header>

      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh"
        }}
      >
        <div className="overlay">
          <h2>NUNCA PARES</h2>
          <p>Descobre a nova coleção desportiva premium.</p>
          <button>Comprar Agora</button>
        </div>
      </section>

      {/* FORM */}
      <section className="products-section">

        <h2>Novidades</h2>

        <button onClick={() => setShowForm(!showForm)}>
          + Adicionar Produto
        </button>

        {showForm && (
          <div className="form">

            <input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Preço"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

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
        <div className="grid">
  {Array.isArray(filteredProducts) &&
    filteredProducts.map((p) => (
      <div className="card" key={p._id}>

  {/* IMAGEM PRINCIPAL APENAS */}
  <img
          src={p.images?.[0]}
          alt={p.name}
          onClick={() => openGallery(p)}
          style={{ cursor: "pointer" }}
        />

        <h3>{p.name}</h3>
        <p>{p.price} €</p>

        <button onClick={() => addToCart(p)}>
          Adicionar ao Carrinho
        </button>

        {logged && (
          <>
            <button onClick={() => editProduct(p)}>Editar</button>
            <button onClick={() => deleteProduct(p._id)}>Apagar</button>
          </>
        )}

      </div>
    ))
  }
</div>
      {/* CARRINHO */}
      {cartOpen && (
  <div className="cart-overlay">
    <div className="cart">
      <h2>🛒 Carrinho</h2>

      <button onClick={() => setCartOpen(false)}>
        Fechar
      </button>

      <button onClick={checkout}>
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

      <h3>Total: {cartTotal.toFixed(2)} €</h3>
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
        {sizes.map((size) => (
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

{/* FOOTER */}
<footer className="footer">
  <p>© 2026 JOMABASTO STORE</p>
</footer>

</div>
); }