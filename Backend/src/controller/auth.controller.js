import db from "../config/db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const novoUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cpf, endereco, telefone, tipo_conta } = req.body;

        if (!nome || !email || !senha || !cpf) {
            return res.status(400).json({
                success: false,
                message: "Campos obrigatórios: nome, email, senha e cpf."
            });
        }

        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        const [resultado] = await db.query(
            `INSERT INTO usuarios (nome, email, senha, cpf, endereco, telefone, tipo_conta) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [nome, email, hashedPassword, cpf, endereco, telefone, tipo_conta || 0]
        );

        return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso.",
            id: resultado.insertId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar usuário.",
            error: error.message
        });
    }
}

export const loginUsuarioEmail = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: "Informe o email e senha."
            });
        }

        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas.", success: false });
        }

        const usuario = rows[0];

        if (!(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ message: "Credenciais inválidas", success: false });
        }

        return res.status(200).json({
            success: true,
            message: "Usuário logado com sucesso",
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                tipo_conta: usuario.tipo_conta,
                endereco: usuario.endereco
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao logar usuário.",
            error: error.message
        });
    }
}


export const loginUsuarioCpf = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return res.status(400).json({
                success: false,
                message: "Informe o CPF e senha."
            });
        }

        const [rows] = await db.query("SELECT * FROM usuarios WHERE cpf = ?", [cpf]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas.", success: false });
        }

        const usuario = rows[0];

        if (!(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ message: "Credenciais inválidas", success: false });
        }

        return res.status(200).json({
            success: true,
            message: "Usuário logado com sucesso",
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                tipo_conta: usuario.tipo_conta,
                endereco: usuario.endereco
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao logar usuário.",
            error: error.message
        });
    }
}
