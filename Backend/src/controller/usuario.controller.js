import db from "../config/db.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
    try {
        const { nome, email, senha, cpf, telefone, endereco, tipo_conta } = req.body

        if (!nome || !email || !senha || !cpf || !telefone || !endereco) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos", success: false })
        }

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(senha, saltRound)

        const [result] = await db.query(
            "INSERT INTO usuarios (nome, email, senha, cpf, telefone, endereco, tipo_conta) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [nome, email, hashPassword, cpf, telefone, endereco, tipo_conta || 0]
        )

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possivel inserir o usuario", success: false })
        }

        return res.status(201).json({ message: "Usuário cadastrado com sucesso", success: true })
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ message: "Erro ao criar usuário", error: error.message })
    }
}


const getUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM usuarios");
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
        return res.status(500).json({ message: "Erro ao buscar usuarios", error: error.message });
    }
}

const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
}

const getUsuarioByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado", success: false });
        }

        return res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
    }
}

const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, cpf, telefone, endereco, senha } = req.body;

        if (!id) {
            return res.status(400).json({ message: "O ID do usuário é obrigatório.", success: false });
        }

        if (!nome || !email) {
            return res.status(400).json({ message: "Nome e email são obrigatórios.", success: false });
        }

        let query = "UPDATE usuarios SET nome = ?, email = ?, cpf = ?, telefone = ?, endereco = ?";
        let params = [nome, email, cpf, telefone, endereco];

        if (senha) {
            const saltRound = 10;
            const hashPassword = await bcrypt.hash(senha, saltRound);
            query += ", senha = ?";
            params.push(hashPassword);
        }

        query += " WHERE id = ?";
        params.push(id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado ou nenhuma alteração foi feita.", success: false });
        }

        return res.status(200).json({ message: "Usuário atualizado com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao editar usuário:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar usuário.", error: error.message });
    }
}

const excluirUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "O ID do usuário é obrigatório.", success: false });
        }

        const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado.", success: false });
        }

        return res.status(200).json({ message: "Usuário excluído com sucesso.", success: true });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return res.status(500).json({ message: "Erro interno ao excluir usuário.", error: error.message });
    }
}

export { createUser, getUsuarios, getUsuarioById, getUsuarioByEmail, editarUsuario, excluirUsuario };
