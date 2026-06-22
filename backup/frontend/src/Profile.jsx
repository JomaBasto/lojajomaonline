import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Profile() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    async function loadProfile() {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
      }
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    await setDoc(doc(db, "users", user.uid), {
      name,
      address,
      phone,
      email: user.email
    });

    alert("Perfil guardado com sucesso!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil do Cliente</h2>

      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Morada completa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Telefone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button onClick={saveProfile}>
        Guardar
      </button>
    </div>
  );
}