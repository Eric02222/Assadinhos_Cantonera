import db from "../config/db.js";

const createPedido = async (req, res) => {
    try {
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador } = req.body;

        if (!lanchePedido || !quantidadePedida || !enderecoPedido || !usuarioComprador) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false });
        }

        const [lancheRows] = await db.query("SELECT * FROM lanches WHERE id = ?", [lanchePedido]);
        if (lancheRows.length === 0) {
            return res.status(404).json({ message: "Lanche não encontrado", success: false });
        }

        const lanche = lancheRows[0];

        if (!lanche.disponivel || lanche.quantidade <= 0) {
            return res.status(400).json({ message: "Lanche indisponível no momento", success: false });
        }

        if (quantidadePedida > lanche.quantidade) {
            return res.status(400).json({ message: `Quantidade solicitada (${quantidadePedida}) maior que a disponível (${lanche.quantidade})`, success: false });
        }

        const novaQuantidade = lanche.quantidade - quantidadePedida;
        const disponivel = novaQuantidade > 0;

        await db.query("UPDATE lanches SET quantidade = ?, disponivel = ? WHERE id = ?", [novaQuantidade, disponivel, lanchePedido]);

        const [result] = await db.query(
            "INSERT INTO pedidos (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador) VALUES (NOW(), ?, ?, ?, ?)",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível realizar o pedido", success: false });
        }

        // Log no histórico
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (NOW(), ?, ?, ?, ?, ?)",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, 'Pedido']
        );

        return res.status(201).json({ message: "Pedido realizado com sucesso", success: true });
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return res.status(500).json({ message: "Erro ao criar pedido", error: error.message });
    }
};

const getPedidos = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, l.nome as lancheNome, u.nome as usuarioNome 
            FROM pedidos p 
            JOIN lanches l ON p.lanchePedido = l.id 
            JOIN usuarios u ON p.usuarioComprador = u.id
        `);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return res.status(500).json({ message: "Erro ao buscar pedidos", error: error.message });
    }
};

const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(`
            SELECT p.*, l.nome as lancheNome, u.nome as usuarioNome 
            FROM pedidos p 
            JOIN lanches l ON p.lanchePedido = l.id 
            JOIN usuarios u ON p.usuarioComprador = u.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        return res.status(500).json({ message: "Erro ao buscar pedido", error: error.message });
    }
};

const editarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador } = req.body;

        if (!id) {
            return res.status(400).json({ message: "O ID do pedido é obrigatório.", success: false });
        }

        if (!lanchePedido || !quantidadePedida || !enderecoPedido || !usuarioComprador) {
            return res.status(400).json({ message: "Informações do pedido são obrigatórias.", success: false });
        }

        const [pedidoAtualRows] = await db.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (pedidoAtualRows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado", success: false });
        }
        const pedidoAtual = pedidoAtualRows[0];

        if (pedidoAtual.lanchePedido !== lanchePedido || pedidoAtual.quantidadePedida !== quantidadePedida) {
            
            await db.query("UPDATE lanches SET quantidade = quantidade + ?, disponivel = true WHERE id = ?", [pedidoAtual.quantidadePedida, pedidoAtual.lanchePedido]);

            const [lancheNovoRows] = await db.query("SELECT * FROM lanches WHERE id = ?", [lanchePedido]);
            if (lancheNovoRows.length === 0) {
                return res.status(404).json({ message: "Novo lanche não encontrado", success: false });
            }
            const lancheNovo = lancheNovoRows[0];

            if (quantidadePedida > lancheNovo.quantidade) {
                 // Reverte a devolução se o novo não tiver estoque suficiente
                await db.query("UPDATE lanches SET quantidade = quantidade - ?, disponivel = (quantidade > 0) WHERE id = ?", [pedidoAtual.quantidadePedida, pedidoAtual.lanchePedido]);
                return res.status(400).json({ message: `Quantidade solicitada (${quantidadePedida}) maior que a disponível (${lancheNovo.quantidade})`, success: false });
            }

            const novaQuantidade = lancheNovo.quantidade - quantidadePedida;
            const disponivel = novaQuantidade > 0;
            await db.query("UPDATE lanches SET quantidade = ?, disponivel = ? WHERE id = ?", [novaQuantidade, disponivel, lanchePedido]);
        }

        const [result] = await db.query(
            "UPDATE pedidos SET lanchePedido = ?, quantidadePedida = ?, enderecoPedido = ?, usuarioComprador = ? WHERE id = ?",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        // Log no histórico
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (NOW(), ?, ?, ?, ?, ?)",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, 'Edição']
        );

        return res.status(200).json({ message: "Pedido atualizado com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao editar pedido:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar pedido.", error: error.message });
    }
};

const excluirPedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do pedido é obrigatório.", success: false });
        }

        // Busca dados do pedido antes de excluir para o histórico
        const [pedidoRows] = await db.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (pedidoRows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }
        const pedido = pedidoRows[0];

        const [result] = await db.query("DELETE FROM pedidos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }

        // Log no histórico
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (NOW(), ?, ?, ?, ?, ?)",
            [pedido.lanchePedido, pedido.quantidadePedida, pedido.enderecoPedido, pedido.usuarioComprador, 'Cancelamento/Exclusão']
        );

        return res.status(200).json({ message: "Pedido excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir pedido:", error);
        return res.status(500).json({ message: "Erro interno ao excluir pedido.", error: error.message });
    }
};

const confirmarEntrega = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do pedido é obrigatório.", success: false });
        }

        // Busca dados do pedido antes de excluir para o histórico
        const [pedidoRows] = await db.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (pedidoRows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }
        const pedido = pedidoRows[0];

        const [result] = await db.query("DELETE FROM pedidos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }

        // Log no histórico
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (NOW(), ?, ?, ?, ?, ?)",
            [pedido.lanchePedido, pedido.quantidadePedida, pedido.enderecoPedido, pedido.usuarioComprador, 'Entrega Realizada']
        );

        return res.status(200).json({ message: "Entrega confirmada com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao confirmar entrega:", error);
        return res.status(500).json({ message: "Erro interno ao confirmar entrega.", error: error.message });
    }
};

export { createPedido, getPedidos, getPedidoById, editarPedido, excluirPedido, confirmarEntrega };
