// Importa a configuração do banco de dados
import db from "../config/db.js";

// Importa o bcrypt para criptografar senhas antes de salvar no banco
import bcrypt from "bcrypt";

// ==========================================
// Função para criar um novo usuário (Cadastro)
// ==========================================
const createUser = async (req, res) => {
    try {
        // Extrai os dados enviados pelo usuário no corpo da requisição
        const { nome, email, senha, cpf, telefone, endereco, tipo_conta } = req.body

        // Validação: verifica se algum dos campos obrigatórios está vazio
        if (!nome || !email || !senha || !cpf || !telefone || !endereco) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false })
        }

        // Define a complexidade do algoritmo de criptografia (10 é um bom padrão)
        const saltRound = 10;
        
        // Criptografa a senha para não salvá-la em texto limpo no banco
        const hashPassword = await bcrypt.hash(senha, saltRound)

        // Insere o novo usuário no banco de dados
        // Nota: Se 'tipo_conta' não for enviado, o padrão será 0 (ex: usuário comum)
        const [result] = await db.query(
            "INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, tipo_conta) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nome, email, hashPassword, cpf, telefone, endereco, tipo_conta || 0]
        )

        // Se nenhuma linha foi inserida, retorna erro
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possivel inserir o usuario", success: false })
        }

        // Retorna sucesso
        return res.status(201).json({ message: "Usuário cadastrado com sucesso", success: true })
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ message: "Erro ao criar usuário", error: error.message })
    }
}

// ==========================================
// Função para buscar TODOS os usuários
// ==========================================
const getUsuarios = async (req, res) => {
    try {
        // Busca todos os registros da tabela de usuários
        const [rows] = await db.query("SELECT * FROM usuarios");
        
        // Retorna a lista de usuários encontrados
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
        return res.status(500).json({ message: "Erro ao buscar usuarios", error: error.message });
    }
}

// ==========================================
// Função para buscar um usuário pelo ID
// ==========================================
const getUsuarioById = async (req, res) => {
    try {
        // Pega o ID passado na URL (ex: /usuarios/2)
        const { id } = req.params;
        
        // Busca o usuário com esse ID específico
        const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);

        // Se não encontrar ninguém, retorna erro 404 (Não Encontrado)
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado", success: false });
        }

        // Retorna o primeiro usuário da lista (como o ID é único, só haverá um)
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
}

// ==========================================
// Função para buscar um usuário pelo E-mail
// ==========================================
const getUsuarioByEmail = async (req, res) => {
    try {
        // Pega o email passado na URL
        const { email } = req.params;
        
        // Busca o usuário no banco de dados usando o email
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        // Se o array voltar vazio, o usuário não existe
        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado", success: false });
        }

        // Retorna os dados do usuário encontrado
        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
}

// ==========================================
// Função para editar/atualizar os dados de um usuário
// ==========================================
const editarUsuario = async (req, res) => {
    try {
        // Pega o ID da URL e os novos dados do corpo da requisição
        const { id } = req.params;
        const { nome, email, cpf, telefone, endereco, senha } = req.body;

        // Valida se o ID foi informado
        if (!id) {
            return res.status(400).json({ message: "O ID do usuário é obrigatório.", success: false });
        }

        // Garante que pelo menos nome e email não fiquem em branco
        if (!nome || !email) {
            return res.status(400).json({ message: "Nome e email são obrigatórios.", success: false });
        }

        // Começa a montar a instrução SQL de atualização
        let query = "UPDATE usuarios SET nome = ?, email = ?, cpf = ?, telefone = ?, endereco = ?";
        let params = [nome, email, cpf, telefone, endereco];

        // Verifica se o usuário enviou uma NOVA SENHA. 
        // Se enviou, precisamos criptografá-la e adicioná-la na query SQL.
        if (senha) {
            const saltRound = 10;
            const hashPassword = await bcrypt.hash(senha, saltRound);
            query += ", senha = ?"; // Adiciona a coluna de senha no UPDATE
            params.push(hashPassword); // Adiciona a senha criptografada na lista de valores
        }

        // Finaliza a query SQL com a condição WHERE para alterar apenas o usuário correto
        query += " WHERE id = ?";
        params.push(id);

        // Executa a query final no banco de dados
        const [result] = await db.query(query, params);

        // Se nenhuma linha foi alterada, o usuário não existe ou os dados já eram iguais
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        // Busca o usuário atualizado no banco para devolver os novos dados como resposta
        const [updatedRows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
        const updatedUser = updatedRows[0];

        // Retorna sucesso junto com os dados atualizados
        return res.status(200).json({
            message: "Usuário atualizado com sucesso.",
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar usuário.", error: error.message });
    }
}

// ==========================================
// Função para excluir uma conta de usuário
// ==========================================
const excluirUsuario = async (req, res) => {
    try {
        // Pega o ID do usuário que quer excluir a conta
        const { id } = req.params;

        // Valida se o ID foi informado
        if (!id) {
            return res.status(400).json({ message: "O ID do usuário é obrigatório.", success: false });
        }

        // Pega o nome do usuário antes de deletá-lo
        const [clienteRows] = await db.query("SELECT nome FROM usuarios WHERE id = ?", [id]);
        const nomeCliente = clienteRows.length > 0 ? clienteRows[0].nome : 'Cliente Desconhecido';

        // Remove a ligação com o ID do usuário (seta NULL), mas salva o NOME dele em texto.
        // Assim a loja não perde o registro de compras antigas feitas por ele.
        await db.query("UPDATE historico SET usuarioComprador = NULL, nomeCliente = ? WHERE usuarioComprador = ?", [nomeCliente, id]);

        // Deleta todos os pedidos ATIVOS vinculados a esse usuário (já que ele não vai mais buscar)
        await db.query("DELETE FROM pedidos WHERE usuarioComprador = ?", [id]);

        // Finalmente, deleta a conta do usuário
        const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

        // Se nenhuma linha foi afetada, o usuário não existia
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado.", success: false });
        }

        // Retorna sucesso
        return res.status(200).json({ message: "Usuário excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return res.status(500).json({ message: "Erro interno ao excluir usuário.", error: error.message });
    }
}

// Exporta as funções para serem utilizadas nas rotas
export { createUser, getUsuarios, getUsuarioById, getUsuarioByEmail, editarUsuario, excluirUsuario };