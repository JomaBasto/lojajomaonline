import { criarCliente } from "./api";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import "./App.css";

export default function App() {

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // 🗑️ APAGAR PRODUTO
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter(p => p.id !== id));
  };

  // ✏️ EDITAR PRODUTO
  const editProduct = async (product) => {
    const newName = prompt("Novo nome:", product.name);
    const newPrice = prompt("Novo preço:", product.price);
    const newImage = prompt("Nova imagem URL:", product.imageUrl);
    const newDescription = prompt("Nova descrição:", product.description);

    if (!newName || !newPrice || !newImage) return;

    await updateDoc(doc(db, "products", product.id), {
      name: newName,
      price: newPrice,
      imageUrl: newImage,
      description: newDescription
    });

    setProducts(products.map(p =>
      p.id === product.id
        ? { ...p, name: newName, price: newPrice, imageUrl: newImage, description: newDescription }
        : p
    ));
  };


  // 🔥 FORM STATE
  const [form, setForm] = useState({
  name: "",
  price: "",
  imageUrl: "",
  category: "homem-running",
  description: "",
  sizes: []
});

  // 🔍 FILTRO PRODUTOS
  const filteredProducts = products.filter((p) => {
    if (category === "all") return true;
    return p.category === category;
  });

  // ➕ ADICIONAR PRODUTO
  const addProduct = async () => {
  if (!form.name || !form.price || !form.imageUrl) return;

  const productData = {
    name: form.name,
    price: form.price,
    imageUrl: form.imageUrl,
    category: form.category,
    description: form.description,
    sizes: []
  };

  await addDoc(collection(db, "products"), productData);

  setForm({
    name: "",
    price: "",
    imageUrl: "",
    category: "homem-running",
    description: "",
    sizes: []
  });

  setShowForm(false);
};

  // 📦 CARREGAR PRODUTOS
  useEffect(() => {
    async function loadProducts() {
      const snapshot = await getDocs(collection(db, "products"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <div>

      {/* HEADER */}
      <header className="header">
        <h1 className="logo">JomaBasto Store</h1>

        <nav className="nav">

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
              <a onClick={() => setCategory("crianca-casual")}>Casual</a>
              <a onClick={() => setCategory("crianca-futebol")}>Futebol</a>
              <a onClick={() => setCategory("crianca-futsal")}>Futsal</a>
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

          <a onClick={() => setCategory("all")}>Outlet</a>

        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="overlay">
          <h2>NUNCA PARES</h2>
          <p>Descobre a nova coleção desportiva premium.</p>
          <button>Comprar Agora</button>
        </div>
      </section>

      {/* BOTÃO FORM */}
      <section className="products-section">

        <h2>🔥 Novidades</h2>

        <button onClick={() => setShowForm(!showForm)}>
          + Adicionar Produto
        </button>


{/* 👟 AQUI É ONDE COLOCAS OS TAMANHOS */}
{showForm && (
  <div className="form">

    <input
      placeholder="Nome"
      value={form.name}
      onChange={(e) =>
        setForm({ ...form, name: e.target.value })
      }
    />

    <input
      placeholder="Preço"
      value={form.price}
      onChange={(e) =>
        setForm({ ...form, price: e.target.value })
      }
    />

    <input
      placeholder="Imagem URL"
      value={form.imageUrl}
      onChange={(e) =>
        setForm({ ...form, imageUrl: e.target.value })
      }
    />

    <select
  value={form.category}
  onChange={(e) =>
    setForm({ ...form, category: e.target.value })
  }
>
  {/* HOMEM */}
  <option value="homem-running">Homem - Running</option>
  <option value="homem-trail">Homem - Trail</option>
  <option value="homem-futebol">Homem - Futebol</option>
  <option value="homem-futsal">Homem - Futsal</option>
  <option value="homem-andebol">Homem - Andebol</option>
  <option value="homem-voleibol">Homem - Voleibol</option>
  <option value="homem-basquetebol">Homem - Basquetebol</option>
  <option value="homem-tenis">Homem - Ténis</option>
  <option value="homem-padel">Homem - Padel</option>
  <option value="homem-casual">Homem - Casual</option>
  <option value="homem-caminhada">Homem - Caminhada</option>

  {/* MULHER */}
  <option value="mulher-running">Mulher - Running</option>
  <option value="mulher-trail">Mulher - Trail</option>
  <option value="mulher-futebol">Mulher - Futebol</option>
  <option value="mulher-futsal">Mulher - Futsal</option>
  <option value="mulher-andebol">Mulher - Andebol</option>
  <option value="mulher-voleibol">Mulher - Voleibol</option>
  <option value="mulher-basquetebol">Mulher - Basquetebol</option>
  <option value="mulher-tenis">Mulher - Ténis</option>
  <option value="mulher-padel">Mulher - Padel</option>
  <option value="mulher-casual">Mulher - Casual</option>
  <option value="mulher-caminhada">Mulher - Caminhada</option>

  {/* CRIANÇA */}
  <option value="crianca-running">Criança - Running</option>
  <option value="crianca-trail">Criança - Trail</option>
  <option value="crianca-futebol">Criança - Futebol</option>
  <option value="crianca-futsal">Criança - Futsal</option>
  <option value="crianca-casual">Criança - Casual</option>

  {/* ACESSÓRIOS */}
  <option value="acessorios-bolas">Acessórios - Bolas</option>
  <option value="acessorios-luvas">Acessórios - Luvas</option>
  <option value="acessorios-meias">Acessórios - Meias</option>
  <option value="acessorios-mochilas">Acessórios - Mochilas</option>
  <option value="acessorios-bones">Acessórios - Bonés</option>
  <option value="acessorios-trail">Acessórios - Trail/Running</option>
  <option value="acessorios-verao">Acessórios - Verão</option>
  <option value="acessorios-outros">Acessórios - Outros</option>
</select>

    <textarea
      placeholder="Descrição"
      value={form.description}
      onChange={(e) =>
        setForm({ ...form, description: e.target.value })
      }
    />

    {/* 👟 TAMANHOS */}
    <input
      placeholder="Tamanhos (ex: 35,36,37,38)"
      value={form.sizesText || ""}
      onChange={(e) =>
        setForm({
          ...form,
          sizesText: e.target.value,
          sizes: e.target.value
            .split(",")
            .map(s => Number(s.trim()))
            .filter(Boolean)
        })
      }
    />

    <button onClick={addProduct}>
      Guardar Produto
    </button>

  </div>
)}

        {/* PRODUTOS */}
<div className="grid">

  {filteredProducts.map((p) => (
    <div className="card" key={p.id}>
      <button onClick={() => deleteProduct(p.id)}>
  Apagar
</button>
<button onClick={() => editProduct(p)}>
  Editar
</button>

      <img src={p.imageUrl} alt={p.name} />

      <h3>{p.name}</h3>
      <p>{p.price} €</p>
      <p>{p.description}</p>

      {/* 👟 TAMANHOS */}
      {p.sizes && (
  <div className="sizes">
    {p.sizes.map((size) => (
      <button key={size}>{size}</button>
    ))}
  </div>
)}

    </div>
  ))}

</div>

      </section>

      <footer className="footer">
        <p>© 2026 JOMA STORE</p>
      </footer>

    </div>
  );
}
