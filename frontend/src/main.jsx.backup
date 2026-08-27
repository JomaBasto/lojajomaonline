import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Success from "./Success.jsx";

import App from "./App.jsx";
import QuemSomos from "./components/QuemSomos.jsx";
import CondicoesUtilizacao from "./components/CondicoesUtilizacao.jsx";
import AvisosLegais from "./components/AvisosLegais.jsx";
import PoliticaPrivacidade from "./components/PoliticaPrivacidade.jsx";
import PoliticaCookies from "./components/PoliticaCookies.jsx";
import Admin from "./Admin.jsx";
import Checkout from "./Checkout.jsx";
import AdminOrders from "./AdminOrders.jsx";
import Promocao from "./Promocao.jsx";
import FichaProduto from "./components/FichaProduto";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sucesso" element={<Success />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/condicoes-de-utilizacao" element={<CondicoesUtilizacao />} />
        <Route path="/avisos-legais" element={<AvisosLegais />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
        <Route path="/promocao" element={<Promocao />} />
        <Route path="/produto/:id" element={<FichaProduto />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);










