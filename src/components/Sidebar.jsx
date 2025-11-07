import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "📊 Dashboard" },
    { to: "/vendas", label: "💰 Vendas" },
    { to: "/clientes", label: "👥 Clientes" },
    { to: "/produtos", label: "📦 Produtos" },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>SofiaTech ERP</h2>
      <ul style={styles.menu}>
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              style={{
                ...styles.link,
                backgroundColor:
                  location.pathname === link.to ? "#2C3E50" : "transparent",
                color:
                  location.pathname === link.to ? "#fff" : "#ECF0F1",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    backgroundColor: "#34495E",
    color: "#ECF0F1",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    position: "fixed",
    left: 0,
    top: 0,
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    display: "block",
    padding: "12px 15px",
    borderRadius: "6px",
    textDecoration: "none",
    transition: "background 0.2s",
  },
};

export default Sidebar;
