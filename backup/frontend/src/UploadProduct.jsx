import { useState } from "react";
import { db, storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function UploadProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!name || !price || !image) {
      alert("Preenche tudo");
      return;
    }

    setLoading(true);

    try {
      // 🔥 nome único (evita conflitos)
      const fileName = `${Date.now()}-${image.name}`;
      const imageRef = ref(storage, `products/${fileName}`);

      // 🚀 upload com progresso
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(percent));
        },
        (error) => {
          console.log(error);
          alert("Erro no upload da imagem");
          setLoading(false);
        },
        async () => {
          // ✅ upload concluído
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "products"), {
            name,
            price: Number(price),
            imageUrl: url,
            createdAt: serverTimestamp(),
          });

          alert("Produto criado com sucesso!");

          setName("");
          setPrice("");
          setImage(null);
          setProgress(0);
          setLoading(false);
        }
      );
    } catch (err) {
      console.log(err);
      alert("Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", marginBottom: 20 }}>
      <h2>➕ Adicionar Produto</h2>

      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? `A enviar... ${progress}%` : "Upload produto"}
      </button>

      {progress > 0 && (
        <p>Progresso: {progress}%</p>
      )}
    </div>
  );
}