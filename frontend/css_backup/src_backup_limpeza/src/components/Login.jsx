const login = async () => {
  try {
    const res = await fetch("https://lojajomaonline-1.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("DATA COMPLETA:", data);

    if (!res.ok) {
      alert(data.message || "Dados errados");
      return;
    }

    // 🔥 GUARDAR TOKEN
    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("TOKEN GUARDADO:", data.token);
    }

    // 🔥 LOGIN ATIVO
    setLogged(true);
    setShowLogin(false);

    // 🔥 ADMIN (ISTO É O QUE ESTAVA A FALTAR)
    setIsAdmin(data.user?.role === "admin");

  } catch (err) {
    console.error("ERRO LOGIN:", err);
    alert("Erro no login");
  }
};