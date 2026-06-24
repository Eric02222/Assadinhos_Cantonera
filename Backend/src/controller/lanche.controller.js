// Importa a conexão com o banco de dados
import db from "../config/db.js";

// ==========================================
// Função para criar/cadastrar um novo lanche
// ==========================================
const createLanche = async (req, res) => {
    try {
        // Pega as informações do lanche enviadas no corpo da requisição
        const { nome, preco, categoria, quantidade, userId } = req.body;

        // Validação: garante que todos os campos obrigatórios vieram preenchidos
        // O uso do "undefined" é porque preço ou quantidade podem ser "0" (o que é válido)
        if (!nome || preco === undefined || !categoria || quantidade === undefined) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false });
        }

        // Define automaticamente se o lanche está disponível com base na quantidade no estoque
        const disponivel = quantidade > 0;

        // Busca as informações do usuário que está criando o lanche (para salvar no histórico)
        const [user] = await db.query("SELECT * FROM usuarios WHERE id = ?", [userId]);

        // Insere o novo lanche no banco de dados
        const [result] = await db.query(
            "INSERT INTO lanches (nome, preco, categoria, quantidade, disponivel) VALUES (?, ?, ?, ?, ?)",
            [nome, preco, categoria, quantidade, disponivel]
        );

        // Se nenhuma linha foi inserida, retorna um erro
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possível inserir o lanche", success: false });
        }

        // Registra a ação de "Lanche Criado" na tabela de histórico
        // Obs: O "userId || 3" significa que se o userId não for passado, ele usa o ID 3 como padrão (ex: um admin do sistema)
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, nomeLanche, quantidadePedida, usuarioComprador, acao, nomeCliente) VALUES (NOW(), ?, ?, 0, ?, 'Lanche Criado', ?)",
            [result.insertId, nome, userId || 3, user.nome]
        );

        // Retorna sucesso
        return res.status(201).json({ message: "Lanche cadastrado com sucesso", success: true });
    } catch (error) {
        console.error("Erro ao criar lanche:", error);
        return res.status(500).json({ message: "Erro ao criar lanche", error: error.message });
    }
}

// ==========================================
// Função para listar TODOS os lanches
// ==========================================
const getLanche = async (req, res) => {
    try {
        // Busca todos os registros da tabela de lanches
        const [rows] = await db.query("SELECT * FROM lanches");
        
        // Retorna a lista de lanches encontrados
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar lanches:", error);
        return res.status(500).json({ message: "Erro ao buscar lanches", error: error.message });
    }
}

// ==========================================
// Função para buscar um lanche ESPECÍFICO pelo ID
// ==========================================
const getLanchesById = async (req, res) => {
    try {
        // Pega o ID passado na URL
        const { id } = req.params;

        // Busca o lanche correspondente a esse ID
        const [rows] = await db.query("SELECT * FROM lanches WHERE id = ?", [id]);

        // Se o array voltar vazio, o lanche não existe
        if (rows.length === 0) {
            return res.status(404).json({ message: "Lanche não encontrado", success: false });
        }

        // Retorna o primeiro (e único) lanche encontrado
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar lanche:", error);
        return res.status(500).json({ message: "Erro ao buscar lanche", error: error.message });
    }
}

// ==========================================
// Função para editar as informações de um lanche
// ==========================================
const editarLanche = async (req, res) => {
    try {
        // Pega o ID do lanche na URL e os novos dados no corpo da requisição
        const { id } = req.params;
        const { nome, preco, categoria, quantidade, userId } = req.body;

        // Verifica se o ID foi informado
        if (!id) {
            return res.status(400).json({ message: "O ID do lanche é obrigatório.", success: false });
        }

        // Validação dos dados que serão atualizados
        if (!nome || preco === undefined || !categoria || quantidade === undefined) {
            return res.status(400).json({ message: "Informações do lanche são obrigatórios e não podem estar vazios.", success: false });
        }

        // Atualiza a disponibilidade baseado na nova quantidade informada
        const disponivel = quantidade > 0;

        // Busca os dados do usuário que está fazendo a alteração
        const [user] = await db.query("SELECT * FROM usuarios WHERE id = ?", [userId]);

        // Executa a atualização (UPDATE) no banco de dados
        const [result] = await db.query(
            "UPDATE lanches SET nome = ?, preco = ?, categoria = ?, quantidade = ?, disponivel = ? WHERE id = ?",
            [nome, preco, categoria, quantidade, disponivel, id]
        );

        // Se nenhuma linha for alterada, o lanche não foi encontrado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Lanche não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        // Registra no histórico que este lanche foi editado
        await db.query(
            "INSERT INTO historico (horarioPedido, lanchePedido, nomeLanche, quantidadePedida, usuarioComprador, acao, nomeCliente) VALUES (NOW(), ?, ?, 0, ?, 'Lanche Editado', ?)",
            [id, nome, userId || 3, user.nome]
        );

        return res.status(200).json({ message: "Lanche atualizado com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao editar lanche:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar lanche.", error: error.message });
    }
}

// ==========================================
// Função para excluir um lanche
// ==========================================
const excluirLanche = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!id) {
            return res.status(400).json({ message: "O ID do lanche é obrigatório.", success: false });
        }

        // Busca o usuário que está fazendo a exclusão
        const [user] = await db.query("SELECT * FROM usuarios WHERE id = ?", [userId]);

        // Busca o nome do lanche antes de excluí-lo, para poder salvar no histórico
        const [lancheRows] = await db.query("SELECT nome FROM lanches WHERE id = ?", [id]);
        const nomeLanche = lancheRows.length > 0 ? lancheRows[0].nome : 'Lanche Desconhecido';

        // Remove a referência deste lanche nas tabelas de histórico e pedidos (seta como NULL).
        // Isso evita erros de "Foreign Key Constraint", já que você não pode deletar um lanche que ainda está vinculado a pedidos antigos.
        await db.query("UPDATE historico SET lanchePedido = NULL WHERE lanchePedido = ?", [id]);
        await db.query("UPDATE pedidos SET lanchePedido = NULL WHERE lanchePedido = ?", [id]);

        // Finalmente, deleta o lanche
        const [result] = await db.query("DELETE FROM lanches WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Lanche não encontrado.", success: false });
        }

        // Segundo registro de "Lanche Excluído" (Este é o mais completo, pois inclui o 'nomeCliente')
        await db.query(
            "INSERT INTO historico (horarioPedido, nomeLanche, quantidadePedida, usuarioComprador, acao, nomeCliente) VALUES (NOW(), ?, 0, ?, 'Lanche Excluído', ?)",
            [nomeLanche, userId || 3, user.nome]
        );

        return res.status(200).json({ message: "Lanche excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir lanche:", error);
        return res.status(500).json({ message: "Erro interno ao excluir lanche.", error: error.message });
    }
}

// Exporta as funções
export { createLanche, getLanche, getLanchesById, editarLanche, excluirLanche };