import db from "../config/db.js";
import bcrypt from "bcrypt";


export const novoUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cpf, endereco, Telefone } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Informe o nome do medicamento."
            });
        }

        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Informe o email."
            });
        }

        if (!senha || senha.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Informe a senha."
            });
        }

        if (!cpf || cpf.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Informe a cpf."
            });
        }

        const hashedPassword = bcrypt.hash(saltRound, senha)

        const [resultado] = await db.query(`INSERT INTO medicamentos(nome, email, senha, cpf, endereco, Telefone) VALUES (?, ?, ?, ?, ?, ?)`, [nome, email, hashedPassword, cpf, endereco, Telefone]);


        return res.status(201).json({
            success: true,
            message: "Usuario cadastrado com sucesso.",
            id: resultado.insertId
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar usuario.",
            error: error
        });
    }
}

export const loginUsuarioEmail = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: "Informe o email e senha do usuario."
            });
        }

        const [rows] = await db.query("SELECT * FROM usuario WHERE email = ?", [email])

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas.", success: false });
        }

        const usuario = rows[0];

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            console.log("teste", usuario)
            return res.status(401).json({ error: "Credenciais inválidas", success: false });
        }

        res.status(200).json({
            usuario: {
                id_cliente: usuario.id_cliente,
                email: usuario.email,
                nome: usuario.nome,
            },
        }).json({ message: "Usuario logado com sucesso" });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erro ao logar usuario.",
            error: error
        });
    }
}


export const loginUsuarioCpf = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        if (!cpf || !senha) {
            return res.status(400).json({
                success: false,
                message: "Informe o email e senha do usuario."
            });
        }

        const [rows] = await db.query("SELECT * FROM usuario WHERE cpf = ?", [cpf])

        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas.", success: false });
        }

        const usuario = rows[0];

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            console.log("teste", usuario)
            return res.status(401).json({ error: "Credenciais inválidas", success: false });
        }

        res.status(200).json({
            usuario: {
                id_cliente: usuario.id_cliente,
                email: usuario.email,
                nome: usuario.nome,
            },
        }).json({ message: "Usuario logado com sucesso" });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Erro ao logar usuario.",
            error: error
        });
    }
}