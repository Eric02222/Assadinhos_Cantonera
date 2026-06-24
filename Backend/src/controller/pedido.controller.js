// Importa a conexão com o banco de dados
import db from "../config/db.js";

// ==========================================
// Função para criar um novo pedido
// ==========================================
const createPedido = async (req, res) => {
    try {
        // Pega as informações enviadas pelo cliente
        const { lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador } = req.body;

        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!lanchePedido || !quantidadePedida || !enderecoPedido || !usuarioComprador) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false });
        }

        // Busca o lanche no banco de dados para verificar se ele existe e ver o estoque atual
        const [lancheRows] = await db.query("SELECT * FROM lanches WHERE id = ?", [lanchePedido]);
        if (lancheRows.length === 0) {
            return res.status(404).json({ message: "Lanche não encontrado", success: false });
        }

        const lanche = lancheRows[0];

        // Verifica se o lanche está marcado como disponível e se tem no estoque (maior que zero)
        if (!lanche.disponivel || lanche.quantidade <= 0) {
            return res.status(400).json({ message: "Lanche indisponível no momento", success: false });
        }

        // Verifica se o cliente pediu mais lanches do que a loja tem no estoque
        if (quantidadePedida > lanche.quantidade) {
            return res.status(400).json({ message: `Quantidade solicitada (${quantidadePedida}) maior que a disponível (${lanche.quantidade})`, success: false });
        }

        // Calcula como vai ficar o estoque depois desse pedido
        const novaQuantidade = lanche.quantidade - quantidadePedida;
        const disponivel = novaQuantidade > 0; // Se a nova quantidade for zero, ele já fica indisponível automaticamente

        // Atualiza a tabela de lanches com o novo estoque (descontando o que foi pedido)
        await db.query("UPDATE lanches SET quantidade = ?, disponivel = ? WHERE id = ?", [novaQuantidade, disponivel, lanchePedido]);

        // Insere o pedido na tabela de pedidos
        const [result] = await db.query(
            "INSERT INTO pedidos (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador) VALUES (NOW(), ?, ?, ?, ?)",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador]
        );

        // Se falhar na inserção, retorna erro
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível realizar o pedido", success: false });
        }

        // Salva o registro no histórico informando que foi feito um novo pedido
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (NOW(), ?, ?, ?, ?, ?)",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, 'Pedido']
        );

        // Retorna sucesso
        return res.status(201).json({ message: "Pedido realizado com sucesso", success: true });
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return res.status(500).json({ message: "Erro ao criar pedido", error: error.message });
    }
};

// ==========================================
// Função para listar TODOS os pedidos
// ==========================================
const getPedidos = async (req, res) => {
    try {
        // Busca os pedidos e junta (JOIN) com as tabelas de lanches e usuários para pegar os nomes, ao invés de mostrar só os IDs
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

// ==========================================
// Função para buscar um pedido ESPECÍFICO pelo ID
// ==========================================
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Faz a mesma busca de cima, mas filtrando apenas pelo ID passado na URL
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

// ==========================================
// Função para editar as informações de um pedido
// ==========================================
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

        // Busca como o pedido está atualmente antes de fazer qualquer alteração
        const [pedidoAtualRows] = await db.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (pedidoAtualRows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado", success: false });
        }
        const pedidoAtual = pedidoAtualRows[0];

        // Se o lanche mudou ou a quantidade mudou, precisamos recalcular o estoque!
        if (pedidoAtual.lanchePedido !== lanchePedido || pedidoAtual.quantidadePedida !== quantidadePedida) {
            
            // Devolve a quantidade do pedido antigo para o estoque original
            await db.query("UPDATE lanches SET quantidade = quantidade + ?, disponivel = true WHERE id = ?", [pedidoAtual.quantidadePedida, pedidoAtual.lanchePedido]);

            // Busca o estoque do NOVO lanche solicitado
            const [lancheNovoRows] = await db.query("SELECT * FROM lanches WHERE id = ?", [lanchePedido]);
            if (lancheNovoRows.length === 0) {
                return res.status(404).json({ message: "Novo lanche não encontrado", success: false });
            }
            const lancheNovo = lancheNovoRows[0];

            // Verifica se tem estoque suficiente para a nova quantidade
            if (quantidadePedida > lancheNovo.quantidade) {
                // Se não tem, ele desfaz o PASSO 1 (tira do estoque de novo) e retorna erro
                await db.query("UPDATE lanches SET quantidade = quantidade - ?, disponivel = (quantidade > 0) WHERE id = ?", [pedidoAtual.quantidadePedida, pedidoAtual.lanchePedido]);
                return res.status(400).json({ message: `Quantidade solicitada (${quantidadePedida}) maior que a disponível (${lancheNovo.quantidade})`, success: false });
            }

            // Se tem estoque, desconta a nova quantidade do banco
            const novaQuantidade = lancheNovo.quantidade - quantidadePedida;
            const disponivel = novaQuantidade > 0;
            await db.query("UPDATE lanches SET quantidade = ?, disponivel = ? WHERE id = ?", [novaQuantidade, disponivel, lanchePedido]);
        }

        // Atualiza os dados do pedido em si (novo endereço, nova quantidade, etc)
        const [result] = await db.query(
            "UPDATE pedidos SET lanchePedido = ?, quantidadePedida = ?, enderecoPedido = ?, usuarioComprador = ? WHERE id = ?",
            [lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        // Salva a alteração no histórico
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

// ==========================================
// Função para excluir/cancelar um pedido
// ==========================================
const excluirPedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do pedido é obrigatório.", success: false });
        }

        // Busca o pedido para saber qual lanche e qual quantidade precisam ser devolvidos ao estoque
        const [pedidoRows] = await db.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (pedidoRows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }
        const pedido = pedidoRows[0];

        // Devolve os lanches cancelados para o estoque (soma a quantidade) e marca como disponível
        await db.query("UPDATE lanches SET quantidade = quantidade + ?, disponivel = true WHERE id = ?", [pedido.quantidadePedida, pedido.lanchePedido]);

        // Exclui o pedido da tabela 'pedidos'
        const [result] = await db.query("DELETE FROM pedidos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }

        // Registra o cancelamento no histórico
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, quantidadePedida, enderecoPedido, usuarioComprador, acao) VALUES (NOW(), ?, ?, ?, ?, ?)",
            [pedido.lanchePedido, pedido.quantidadePedida, pedido.enderecoPedido, pedido.usuarioComprador, 'Cancelamento']
        );

        return res.status(200).json({ message: "Pedido excluído com sucesso e estoque atualizado.", success: true });
    } catch (error) {
        console.error("Erro ao excluir pedido:", error);
        return res.status(500).json({ message: "Erro interno ao excluir pedido.", error: error.message });
    }
};

// ==========================================
// Função para confirmar a entrega de um pedido
// ==========================================
const confirmarEntrega = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do pedido é obrigatório.", success: false });
        }

        // Busca as informações do pedido que está sendo entregue
        const [pedidoRows] = await db.query("SELECT * FROM pedidos WHERE id = ?", [id]);
        if (pedidoRows.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }
        const pedido = pedidoRows[0];

        // Remove o pedido da tabela de pedidos ativos 
        const [result] = await db.query("DELETE FROM pedidos WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido não encontrado.", success: false });
        }

        // Registra no histórico que a entrega foi concluída
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

// Exporta todas as funções para serem usadas nas rotas
export { createPedido, getPedidos, getPedidoById, editarPedido, excluirPedido, confirmarEntrega };