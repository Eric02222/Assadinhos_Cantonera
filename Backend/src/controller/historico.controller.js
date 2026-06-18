import db from "../config/db.js";

const createHistorico = async (req, res) => {
    try {
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, horarioPedido, acao } = req.body;

        if (!lanchePedido || !quantidadePedida || !enderecoPedido || !usuarioComprador) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false });
        }

        const [result] = await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (?, ?, ?, ?, ?, ?)",
            [horarioPedido || new Date(), lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao || 'Pedido']
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível inserir no histórico", success: false });
        }

        return res.status(201).json({ message: "Histórico criado com sucesso", success: true });
    } catch (error) {
        console.error("Erro ao criar histórico:", error);
        return res.status(500).json({ message: "Erro ao criar histórico", error: error.message });
    }
};

const getHistorico = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT h.*, COALESCE(h.nomeLanche, l.nome, 'Lanche Excluído') as lancheNome, u.nome as usuarioNome, 
                   CASE WHEN u.tipo_conta = 1 THEN 'Admin' ELSE 'Cliente' END as tipoConta
            FROM historico h 
            LEFT JOIN lanches l ON h.lanchePedido = l.id 
            JOIN usuarios u ON h.usuarioComprador = u.id
            ORDER BY h.horarioPedido DESC
        `);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        return res.status(500).json({ message: "Erro ao buscar histórico", error: error.message });
    }
};

const getHistoricoByUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const [rows] = await db.query(`
            SELECT h.*, l.nome as lancheNome, u.nome as usuarioNome 
            FROM historico h 
            JOIN lanches l ON h.lanchePedido = l.id 
            JOIN usuarios u ON h.usuarioComprador = u.id
            WHERE h.usuarioComprador = ?
        `, [usuarioId]);

        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar histórico do usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar histórico do usuário", error: error.message });
    }
};

const editarHistorico = async (req, res) => {
    try {
        const { id } = req.params;
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, horarioPedido } = req.body;

        if (!id) {
            return res.status(400).json({ message: "O ID do histórico é obrigatório.", success: false });
        }

        const [result] = await db.query(
            "UPDATE historico SET lanchePedido = ?, quantidadePedida = ?, enderecoPedido = ?, usuarioComprador = ?, horarioPedido = ? WHERE id = ?",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, horarioPedido, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Histórico não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        return res.status(200).json({ message: "Histórico atualizado com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao editar histórico:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar histórico.", error: error.message });
    }
};

const excluirHistorico = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do histórico é obrigatório.", success: false });
        }

        const [result] = await db.query("DELETE FROM historico WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Histórico não encontrado.", success: false });
        }

        return res.status(200).json({ message: "Histórico excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir histórico:", error);
        return res.status(500).json({ message: "Erro interno ao excluir histórico.", error: error.message });
    }
};

export { createHistorico, getHistorico, getHistoricoByUsuario, editarHistorico, excluirHistorico };
