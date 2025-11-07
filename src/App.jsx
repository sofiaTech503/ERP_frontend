import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Vendas from "./pages/Vendas";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/produtos" element={<Produtos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
