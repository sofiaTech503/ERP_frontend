import React, { useEffect, useState } from "react";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("http://localhost:3001/produtos");
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) return <p>🔄 Carregando produtos...</p>;

  // Filtragem exata
  const produtosFiltrados = produtos.filter((produto) => {
    if (!busca) return true;

    return (
      produto.id.toString() === busca ||
      produto.nome.toLowerCase() === busca.toLowerCase() ||
      produto.preco.toString() === busca
    );
  });

  return (
    <div style={styles.container}>
      <h1>📦 Produtos</h1>

      <input
        type="text"
        placeholder="Digite ID, Nome ou Preço"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={styles.input}
      />

      {produtosFiltrados.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Preço (R$)</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id}>
                <td style={styles.td}>{produto.id}</td>
                <td style={styles.td}>{produto.nome}</td>
                <td style={styles.td}>{produto.preco.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "right",
    padding: "20px",
  },
  input: {
    padding: "8px",
    marginBottom: "15px",
    width: "300px",
    fontSize: "16px",
  },
  table: {
    width: "80%",
    borderCollapse: "collapse",
    textAlign: "center",
  },
  th: {
    background: "#f2f2f2",
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
  },
};

export default Produtos;
