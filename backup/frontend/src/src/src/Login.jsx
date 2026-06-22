import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCredential.user);
    } catch (error) {
      alert("Login inválido");
      console.log(error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Admin Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}