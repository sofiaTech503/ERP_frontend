import React, { useEffect, useState } from "react";

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErro(null);

      try {
        // Ajuste as URLs caso seu backend rode em outra porta/rota
        const [vendasRes, clientesRes] = await Promise.all([
          fetch("http://localhost:3001/vendas"),
          fetch("http://localhost:3001/clientes"),
        ]);

        if (!vendasRes.ok) throw new Error(`Erro /vendas: ${vendasRes.status}`);
        if (!clientesRes.ok) throw new Error(`Erro /clientes: ${clientesRes.status}`);

        const vendasData = await vendasRes.json();
        const clientesData = await clientesRes.json();

        // logs para inspecionar formato — verifique no console do navegador
        console.log(">>> vendas (resposta)", vendasData);
        console.log(">>> clientes (resposta)", clientesData);

        setVendas(Array.isArray(vendasData) ? vendasData : []);
        setClientes(Array.isArray(clientesData) ? clientesData : []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setErro(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>🔄 Carregando vendas...</p>;
  if (erro) return <p style={{ color: "red" }}>❌ {erro}</p>;

  // Cria um mapa robusto de clientes: tenta detectar id e nome em várias formas
  const mapaClientes = {};
  clientes.forEach((c) => {
    // detecta possíveis campos de id e nome
    const id = c.id ?? c.cliente_id ?? c.clienteId ?? c._id;
    const nome = c.nome ?? c.name ?? c.fullName ?? c.nome_cliente;
    if (id != null) mapaClientes[id] = nome ?? String(id);
  });

  // Função auxiliar para extrair o nome do cliente a partir de uma venda
  const obterNomeCliente = (venda) => {
    // 1) se a venda já trouxe o objeto do cliente (ex: venda.cliente: { id, nome })
    if (venda.cliente && typeof venda.cliente === "object") {
      return venda.cliente.nome ?? venda.cliente.name ?? venda.cliente.fullName ?? "Sem nome";
    }

    // 2) tenta campos comuns de id dentro da venda
    const clienteId = venda.clienteId ?? venda.cliente_id ?? venda.cliente ?? venda.clienteId;
    if (clienteId != null) {
      return mapaClientes[clienteId] ?? String(clienteId);
    }

    // 3) se não encontrou, tenta procurar por um campo `cliente_nome` ou similar direto na venda
    return venda.cliente_nome ?? venda.nome_cliente ?? venda.clienteNome ?? "Desconhecido";
  };

  // Filtra vendas pelo nome do cliente (busca por substring, case-insensitive)
  const vendasFiltradas = vendas.filter((venda) => {
    if (!busca) return true;
    const nome = (obterNomeCliente(venda) || "").toString().toLowerCase();
    return nome.includes(busca.trim().toLowerCase());
  });

  return (
    <div style={styles.container}>
      <h1>💰 Vendas</h1>

      <input
        type="text"
        placeholder="Buscar por nome do cliente (ex: Ana)"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={styles.input}
      />

      {vendasFiltradas.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Produto</th>
              <th style={styles.th}>Quantidade</th>
              <th style={styles.th}>Valor Total (R$)</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((venda) => {
              const nomeCliente = obterNomeCliente(venda);
              // tenta extrair nome do produto quando possível
              const nomeProduto =
                (venda.produto && (venda.produto.nome || venda.produto.name)) ||
                venda.produto_nome ||
                venda.produtoName ||
                venda.produtoId ??
                venda.produto_id ??
                "Desconhecido";

              const valor = venda.valorTotal ?? venda.total ?? (venda.quantidade && venda.preco_unitario ? venda.quantidade * venda.preco_unitario : 0);

              return (
                <tr key={venda.id ?? venda._id ?? Math.random()}>
                  <td style={styles.td}>{venda.id ?? venda._id}</td>
                  <td style={styles.td}>{nomeCliente}</td>
                  <td style={styles.td}>{nomeProduto}</td>
                  <td style={styles.td}>{venda.quantidade ?? "-"}</td>
                  <td style={styles.td}>
                    R$ {Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  input: {
    padding: "8px",
    marginBottom: "15px",
    width: "350px",
    fontSize: "16px",
  },
  table: {
    width: "100%",
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
