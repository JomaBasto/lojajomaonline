import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Success from "./Success.jsx";

import App from "./App.jsx";
import QuemSomos from "./components/QuemSomos.jsx";
import Admin from "./Admin.jsx";
import Checkout from "./Checkout.jsx";
import AdminOrders from "./AdminOrders.jsx";`r`nimport Promocao from "./Promocao.jsx";`r`nimport FichaProduto from "./components/FichaProduto";
import Promocao from "./Promocao.jsx";

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
        <Route path="/promocao" element={<Promocao />} />`r`n        <Route path="/produto/:id" element={<FichaProduto />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);






