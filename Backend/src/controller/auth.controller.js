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
        if (senha === "") {
            return res.status(400).json({ message: "O campo confirmar senha é obrigatório. Não deve estar vazio.", success: false })
        } else {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

            if (!regex.test(senha)) {
                return res.status(400).json({ message: "A senha não corresponde as regras impostas para uma senha forte", success: false })
            };
        };

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

export const esqueciSenha = async (req, res) => {
    try {
        const email = req.body.email
        const senha = req.body.novaSenha
        const confirmar_senha = req.body.confirmarSenha


        if (email === "") {
            return res.status(400).json({ message: "Email não deve estar vazio. Ele é obrigatório.", success: false })
        }

        if (senha === "") {
            return res.status(400).json({ message: "Senha não deve estar vazio. Ela é obrigatório.", success: false })
        } else {
            if (senha.length < 6 || senha.length > 12) {
                return res.status(400).json({ message: "A senha deve somente de 6 a 12 caracteres.", success: false })

            };
        };

        if (confirmar_senha === "") {
            return res.status(400).json({ message: "O campo confirmar senha é obrigatório. Não deve estar vazio.", success: false })
        } else {
            if (confirmar_senha !== senha) {
                return res.status(400).json({ message: "O campo confirmar senha não é igual a senha. Tente novamente.", success: false })
            };
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

            if (!regex.test(senha)) {
                return res.status(400).json({ message: "A senha não corresponde as regras impostas para uma senha forte", success: false })
            };
        };

        const [row] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);

        if (row.length === 0) {
            return res.status(400).json({ message: "Esse ussuário não foi encontrado", success: false })
        }

        const user = row[0];

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(senha, saltRound) 

        const [result] = await db.query("UPDATE usuarios SET senha = ? WHERE id = ?", [hashPassword, user.id])

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possivel resetar a sua senha. Tente novamente.", success: false })
        }

        return res.status(201).json({ message: "Senha atualizada com sucesso", success: true })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao recuperar senha.",
            error: error.message
        });
    }
}