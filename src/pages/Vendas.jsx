import React, { useEffect, useState } from "react";

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const response = await fetch("http://localhost:3001/vendas");
        const data = await response.json();
        setVendas(data);
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendas();
  }, []);

  if (loading) return <p>🔄 Carregando vendas...</p>;

  // 🔍 Filtra apenas por cliente_id
  const vendasFiltradas = vendas.filter((venda) => {
    if (!busca) return true;
    // Considera tanto clienteId quanto cliente_id, para garantir compatibilidade
    const clienteId = venda.clienteId ?? venda.cliente_id;
    return clienteId?.toString() === busca.trim();
  });

  return (
    <div style={styles.container}>
      <h1>💰 Vendas</h1>

      <input
        type="text"
        placeholder="Buscar por Cliente ID"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={styles.input}
      />

      {vendasFiltradas.length === 0 ? (
        <p>Nenhuma venda encontrada para este cliente.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cliente ID</th>
              <th style={styles.th}>Produto ID</th>
              <th style={styles.th}>Quantidade</th>
              <th style={styles.th}>Valor Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((venda) => (
              <tr key={venda.id}>
                <td style={styles.td}>{venda.id}</td>
                <td style={styles.td}>{venda.clienteId ?? venda.cliente_id}</td>
                <td style={styles.td}>{venda.produtoId ?? venda.produto_id}</td>
                <td style={styles.td}>{venda.quantidade}</td>
                <td style={styles.td}>
                  {venda.valorTotal ? venda.valorTotal.toFixed(2) : "0.00"}
                </td>
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
    alignItems: "left",
    padding: "20px",
  },
  input: {
    padding: "8px",
    marginBottom: "15px",
    width: "350px",
    fontSize: "16px",
  },
  table: {
    width: "90%",
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

export default Vendas;
