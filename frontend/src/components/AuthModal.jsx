export default function AuthModal({
  mode,
  email,
  password,
  registerName,
  registerEmail,
  registerPassword,
  registerTelefone,
  registerMorada,
  registerCodigoPostal,
  registerLocalidade,
  registerNif,
  setEmail,
  setPassword,
  setRegisterName,
  setRegisterEmail,
  showForgotPassword,
  forgotPasswordEmail,
  setForgotPasswordEmail,
  setRegisterPassword,
  setShowForgotPassword,
  forgotPassword,
  setRegisterTelefone,
  setRegisterMorada,
  setRegisterCodigoPostal,
  setRegisterLocalidade,
  setRegisterNif,
  login,
  register,
  onClose,
  onSwitch
}) {
  const isLogin = mode === "login";

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    border: "1px solid #d8d8d8",
    borderRadius: "6px",
    fontSize: "15px",
    color: "#111",
    background: "#fff",
    outline: "none"
  };

  const primaryButtonStyle = {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "4px",
    background: "#111",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer"
  };

  const secondaryButtonStyle = {
    width: "100%",
    padding: "15px",
    border: "1px solid #111",
    borderRadius: "4px",
    background: "#fff",
    color: "#111",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.8px",
    cursor: "pointer"
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "100px 20px 20px",
        boxSizing: "border-box"
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
          boxSizing: "border-box",
          background: "#fff",
          borderRadius: "4px",
          padding: "42px 42px 38px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.28)"
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            width: "32px",
            height: "32px",
            border: "none",
            background: "transparent",
            color: "#111",
            fontSize: "25px",
            lineHeight: 1,
            cursor: "pointer"
          }}
        >
          x
        </button>

        <div style={{ textAlign: "center" }}>
          <img
            src="/jomabasto.png"
            alt="JomaBasto"
            style={{
              display: "block",
              width: "145px",
              maxWidth: "65%",
              height: "auto",
              margin: "0 auto 28px"
            }}
          />

          <h2
            style={{
              margin: 0,
              color: "#111",
              fontSize: "28px",
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}
          >
            {isLogin ? "Entrar na sua conta" : "Criar a sua conta"}
          </h2>

          <p
            style={{
              margin: "10px 0 30px",
              color: "#666",
              fontSize: "14px",
              lineHeight: 1.5
            }}
          >
            {isLogin
              ? "Aceda à sua conta JomaBasto."
              : "Crie a sua conta JomaBasto."}
          </p>
        </div>

        {isLogin ? (
          <>
          <div style={{ display: "grid", gap: "14px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />

            <input
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={{
                border: "none",
                background: "transparent",
                padding: "0",
                color: "#111",
                fontSize: "13px",
                textDecoration: "underline",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              Esqueceu-se da palavra-passe?
            </button>

            <button
              type="button"
              onClick={login}
              style={{ ...primaryButtonStyle, marginTop: "6px" }}
            >
              ENTRAR
            </button>
          </div>

          {showForgotPassword && (
            <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid #e5e5e5" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>
                Recuperar palavra-passe
               </div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.5, marginBottom: "12px" }}>
                Introduza o seu email para receber as instruções de recuperação.
              </div>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Email"
                style={inputStyle}
                autoComplete="email"
              />
              <button
                type="button"
                onClick={forgotPassword}
                style={{ ...primaryButtonStyle, marginTop: "6px" }}
              >
                ENVIAR INSTRUÇÕES
              </button>
            </div>
          )}
          </>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            <input
              type="text"
              placeholder="Nome"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              style={inputStyle}
              autoComplete="name"
            />

            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />

            <input
              type="password"
              placeholder="Palavra-passe"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />

            <input
              type="tel"
              placeholder="Telefone"
              value={registerTelefone}
              onChange={(e) => setRegisterTelefone(e.target.value)}
              style={inputStyle}
              autoComplete="tel"
            />

            <input
              type="text"
              placeholder="Morada"
              value={registerMorada}
              onChange={(e) => setRegisterMorada(e.target.value)}
              style={inputStyle}
              autoComplete="street-address"
            />

            <input
              type="text"
              placeholder="Código Postal"
              value={registerCodigoPostal}
              onChange={(e) => setRegisterCodigoPostal(e.target.value)}
              style={inputStyle}
              autoComplete="postal-code"
            />

            <input
              type="text"
              placeholder="Localidade"
              value={registerLocalidade}
              onChange={(e) => setRegisterLocalidade(e.target.value)}
              style={inputStyle}
              autoComplete="address-level2"
            />

            <input
              type="text"
              placeholder="NIF (opcional)"
              value={registerNif}
              onChange={(e) => setRegisterNif(e.target.value)}
              style={inputStyle}
              autoComplete="off"
            />

            <button
              type="button"
              onClick={register}
              style={{ ...primaryButtonStyle, marginTop: "6px" }}
            >
              CRIAR CONTA
            </button>
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            paddingTop: "24px",
            borderTop: "1px solid #e8e8e8",
            textAlign: "center"
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#666",
              fontSize: "14px"
            }}
          >
            {isLogin
              ? "Ainda não tem uma conta?"
              : "Já tem uma conta?"
              }
           </p>
          <button
            type="button"
            onClick={onSwitch}
            style={secondaryButtonStyle}
          >
            {isLogin ? "CRIAR CONTA" : "ENTRAR"}
          </button>
        </div>
      </div>
    </div>
  );
}



