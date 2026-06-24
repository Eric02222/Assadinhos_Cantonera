// Importa a configuração de conexão com o banco de dados
import db from "../config/db.js";

// ==========================================
// Função para criar um novo registro no histórico (ex: um novo pedido)
// ==========================================
const createHistorico = async (req, res) => {
    try {
        // Extrai os dados enviados pelo cliente no corpo da requisição (req.body)
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, nomeCliente, horarioPedido, acao } = req.body;

        // Validação: verifica se todos os campos obrigatórios foram preenchidos
        if (!lanchePedido || !quantidadePedida || !enderecoPedido || !usuarioComprador || !nomeCliente) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false });
        }

        // Insere os dados na tabela 'historico'. 
        // Se 'horarioPedido' ou 'acao' não forem passados, ele usa a data atual e a ação padrão 'Pedido'.
        const [result] = await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, nomeCliente, acao) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [horarioPedido || new Date(), lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, nomeCliente, acao || 'Pedido']
        );

        // Se nenhuma linha foi afetada no banco, significa que a inserção falhou
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível inserir no histórico", success: false });
        }

        // Retorna sucesso confirmando que o histórico foi criado
        return res.status(201).json({ message: "Histórico criado com sucesso", success: true });
    } catch (error) {
        // Registra o erro no console do servidor e retorna status 500 para o cliente
        console.error("Erro ao criar histórico:", error);
        return res.status(500).json({ message: "Erro ao criar histórico", error: error.message });
    }
};

// ==========================================
// Função para buscar TODOS os registros do histórico
// ==========================================
const getHistorico = async (req, res) => {
    try {
        // Busca os históricos e faz a junção (JOIN) com as tabelas de lanches e usuários para pegar os nomes reais.
        // O comando COALESCE garante que, se o lanche ou usuário tiverem sido excluídos do banco, apareça 'Lanche Excluído' ou 'Usuário Excluído' em vez de quebrar a tela.
        // ORDER BY h.horarioPedido DESC ordena do pedido mais recente para o mais antigo.
        const [rows] = await db.query(`
            SELECT h.*, COALESCE(h.nomeLanche, l.nome, 'Lanche Excluído') as lancheNome, 
                   COALESCE(h.nomeCliente, u.nome, 'Usuário Excluído') as usuarioNome
            FROM historico h 
            LEFT JOIN lanches l ON h.lanchePedido = l.id 
            LEFT JOIN usuarios u ON h.usuarioComprador = u.id
            ORDER BY h.horarioPedido DESC
        `);
        
        // Retorna os dados encontrados com sucesso
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return res.status(500).json({ message: "Erro ao buscar histórico", error: error.message });
    }
};

// ==========================================
// Função para buscar o histórico de um usuário ESPECÍFICO
// ==========================================
const getHistoricoByUsuario = async (req, res) => {
    try {
        // Pega o ID do usuário que vem na URL da requisição (ex: /historico/5)
        const { usuarioId } = req.params;

        // Busca apenas os registros cujo 'usuarioComprador' seja igual ao ID fornecido
        const [rows] = await db.query(`
            SELECT h.*, l.nome as lancheNome, u.nome as usuarioNome 
            FROM historico h 
            JOIN lanches l ON h.lanchePedido = l.id 
            JOIN usuarios u ON h.usuarioComprador = u.id
            WHERE h.usuarioComprador = ?
        `, [usuarioId]);

        // Retorna a lista de pedidos do usuário
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar histórico do usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar histórico do usuário", error: error.message });
    }
};

// ==========================================
// Função para editar/atualizar um registro do histórico
// ==========================================
const editarHistorico = async (req, res) => {
    try {
        // Pega o ID do histórico que será editado através da URL
        const { id } = req.params;
        
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, horarioPedido, nomeLanche, nomeCliente } = req.body;

        // Verifica se o ID foi informado
        if (!id) {
            return res.status(400).json({ message: "O ID do histórico é obrigatório.", success: false });
        }

        // Faz o UPDATE dos dados na tabela 'historico' usando o ID fornecido
        const [result] = await db.query(
            "UPDATE historico SET lanchePedido = ?, quantidadePedida = ?, enderecoPedido = ?, usuarioComprador = ?, horarioPedido = ?, nomeLanche = ?, nomeCliente = ? WHERE id = ?",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, horarioPedido, nomeLanche, nomeCliente, id]
        );

        // Se nenhuma linha foi afetada, o ID pode não existir ou os dados passados eram exatamente iguais aos que já estavam salvos
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Histórico não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        // Sucesso na edição
        return res.status(200).json({ message: "Histórico atualizado com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao editar histórico:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar histórico.", error: error.message });
    }
};

// ==========================================
// Função para excluir um registro do histórico
// ==========================================
const excluirHistorico = async (req, res) => {
    try {
        // Pega o ID do histórico a ser excluído da URL
        const { id } = req.params;

        // Valida se o ID foi fornecido
        if (!id) {
            return res.status(400).json({ message: "O ID do histórico é obrigatório.", success: false });
        }

        // Executa o comando de exclusão (DELETE) no banco de dados para esse ID
        const [result] = await db.query("DELETE FROM historico WHERE id = ?", [id]);

        // Se nenhuma linha foi afetada, o histórico com esse ID não existia
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Histórico não encontrado.", success: false });
        }

        // Sucesso na exclusão
        return res.status(200).json({ message: "Histórico excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir histórico:", error);
        return res.status(500).json({ message: "Erro interno ao excluir histórico.", error: error.message });
    }
};

// Exporta todas as funções para poderem ser usadas no arquivo de rotas (routes)
export { createHistorico, getHistorico, getHistoricoByUsuario, editarHistorico, excluirHistorico };