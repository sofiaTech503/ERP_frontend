import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#F5F6FA",
  },
  content: {
    flex: 1,
    marginLeft: "220px", // mesmo tamanho da sidebar
    padding: "30px",
    overflowY: "auto",
  },
};

export default Layout;
