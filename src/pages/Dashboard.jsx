import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendas: 0,
    totalClientes: 0,
    totalProdutos: 0,
    estoqueTotal: 0,
  });

  const [dadosCompletos, setDadosCompletos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos"); // 🔍 tipo de busca
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vendasRes, clientesRes, produtosRes] = await Promise.all([
          fetch("http://localhost:3001/vendas"),
          fetch("http://localhost:3001/clientes"),
          fetch("http://localhost:3001/produtos"),
        ]);

        const [vendas, clientes, produtos] = await Promise.all([
          vendasRes.json(),
          clientesRes.json(),
          produtosRes.json(),
        ]);

        // 🔗 Juntar dados pelo ID
        const vendasCompletas = vendas.map((v) => {
          const cliente = clientes.find((c) => c.id === v.cliente_id);
          const produto = produtos.find((p) => p.id === v.produto_id);
          return {
            ...v,
            clienteNome: cliente ? cliente.nome : "Desconhecido",
            produtoNome: produto ? produto.nome : "Desconhecido",
          };
        });

        // Totais
        const totalVendas = vendas.length;
        const totalClientes = clientes.length;
        const totalProdutos = produtos.length;
        const estoqueTotal = produtos.reduce(
          (soma, p) => soma + (p.estoque || 0),
          0
        );

        setStats({ totalVendas, totalClientes, totalProdutos, estoqueTotal });
        setDadosCompletos(vendasCompletas);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <h2>Carregando dados...</h2>;

  // 🔍 Filtro por nome de cliente, produto ou ID
  const vendasFiltradas = dadosCompletos.filter((v) => {
    if (!filtro) return true;
    const termo = filtro.toLowerCase();
    if (tipoFiltro === "cliente")
      return v.clienteNome.toLowerCase().includes(termo);
    if (tipoFiltro === "produto")
      return v.produtoNome.toLowerCase().includes(termo);
    if (tipoFiltro === "venda") return v.id.toString() === termo;
    // filtro geral
    return (
      v.clienteNome.toLowerCase().includes(termo) ||
      v.produtoNome.toLowerCase().includes(termo) ||
      v.id.toString() === termo
    );
  });

  // 🎨 Dados dos gráficos
  const produtosLabels = [...new Set(vendasFiltradas.map((v) => v.produtoNome))];
  const vendasPorProduto = produtosLabels.map(
    (nome) => vendasFiltradas.filter((v) => v.produtoNome === nome).length
  );
  const estoquePorProduto = produtosLabels.map(() => Math.floor(Math.random() * 50) + 1); // simulado

  const vendasData = {
    labels: produtosLabels,
    datasets: [
      {
        label: "Vendas por Produto",
        data: vendasPorProduto,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const estoqueData = {
    labels: produtosLabels,
    datasets: [
      {
        label: "Estoque por Produto",
        data: estoquePorProduto,
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* 🔍 Filtro */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={styles.select}
        >
          <option value="todos">Todos</option>
          <option value="cliente">Cliente</option>
          <option value="produto">Produto</option>
          <option value="venda">Venda (ID)</option>
        </select>

        <input
          type="text"
          placeholder="Digite para filtrar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Cards */}
      <div style={styles.cardsContainer}>
        <div style={{ ...styles.card, backgroundColor: "#3498DB" }}>
          <h3 style={styles.cardTitle}>Clientes</h3>
          <p style={styles.cardValue}>{stats.totalClientes}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#2ECC71" }}>
          <h3 style={styles.cardTitle}>Vendas</h3>
          <p style={styles.cardValue}>{stats.totalVendas}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#F1C40F" }}>
          <h3 style={styles.cardTitle}>Produtos</h3>
          <p style={styles.cardValue}>{stats.totalProdutos}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#E74C3C" }}>
          <h3 style={styles.cardTitle}>Estoque Total</h3>
          <p style={styles.cardValue}>{stats.estoqueTotal}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div style={styles.chartsContainer}>
        <div style={styles.chartCard}>
          <h3>Vendas por Produto</h3>
          <Bar data={vendasData} />
        </div>
        <div style={styles.chartCard}>
          <h3>Estoque por Produto</h3>
          <Line data={estoqueData} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "30px", backgroundColor: "#f8f9fc" },
  title: { marginBottom: "20px" },
  select: {
    padding: "10px",
    marginRight: "10px",
    fontSize: "16px",
  },
  input: {
    padding: "10px",
    width: "300px",
    fontSize: "16px",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px",
    marginBottom: "40px",
  },
  card: {
    color: "#fff",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  },
  cardTitle: { fontSize: "18px", fontWeight: "600" },
  cardValue: { fontSize: "30px", marginTop: "10px" },
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};

export default Dashboard;
