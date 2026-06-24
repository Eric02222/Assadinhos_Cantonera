// Importa a configuração de conexão com o banco de dados
import db from "../config/db.js";

// Importa o bcrypt, uma biblioteca usada para criptografar (hashear) senhas
import bcrypt from "bcrypt";

// Define a complexidade do cálculo do hash da senha (10 é o padrão recomendado)
const saltRounds = 10;

// ==========================================
// Função para registrar um novo usuário
// ==========================================
export const novoUsuario = async (req, res) => {
    try {
        // Extrai os dados enviados pelo cliente no corpo da requisição
        const { nome, email, senha, cpf, endereco, telefone, tipo_conta } = req.body;

        // Validação básica: verifica se os campos essenciais foram preenchidos
        if (!nome || !email || !senha || !cpf) {
            return res.status(400).json({
                success: false,
                message: "Campos obrigatórios: nome, email, senha e cpf."
            });
        }

        // Verifica se a senha está em branco
        if (senha === "") {
            return res.status(400).json({ 
                message: "O campo confirmar senha é obrigatório. Não deve estar vazio.", 
                success: false 
            })
        } else {
            // Expressão regular (Regex) para forçar uma senha forte: 
            // Pelo menos 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial e tamanho de 6 a 12 caracteres.
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

            // Se a senha não passar na validação do Regex, retorna erro
            if (!regex.test(senha)) {
                return res.status(400).json({ 
                    message: "A senha não corresponde as regras impostas para uma senha forte", 
                    success: false 
                })
            };
        };

        // Criptografa a senha do usuário antes de salvá-la no banco de dados para segurança
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Insere o novo usuário no banco de dados com a senha já criptografada
        const [resultado] = await db.query(
            `INSERT INTO usuarios (nome, email, senha, cpf, endereco, telefone, tipo_conta) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [nome, email, hashedPassword, cpf, endereco, telefone, tipo_conta || 0]
        );

        // Retorna sucesso com o ID do usuário recém-criado
        return res.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso.",
            id: resultado.insertId
        });
    } catch (error) {
        // Caso ocorra algum erro no processo, registra no console e retorna erro 500 (Erro de Servidor)
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar usuário.",
            error: error.message
        });
    }
}

// ==========================================
// Função para login de usuário por Email
// ==========================================
export const loginUsuarioEmail = async (req, res) => {
    try {
        // Pega o email e a senha digitados pelo usuário
        const { email, senha } = req.body;

        // Verifica se os campos não estão vazios
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: "Informe o email e senha."
            });
        }

        // Busca no banco de dados se existe algum usuário com esse email
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

        // Se não encontrar nenhum usuário, retorna erro de credenciais
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas.", success: false });
        }

        // Armazena os dados do usuário encontrado na variável 'usuario'
        const usuario = rows[0];

        // Compara a senha digitada com a senha criptografada que está salva no banco
        if (!(await bcrypt.compare(senha, usuario.senha))) {
            // Se as senhas não baterem, recusa o login
            return res.status(401).json({ message: "Credenciais inválidas", success: false });
        }

        // Se o login for bem sucedido, retorna os dados do usuário (sem a senha, por segurança)
        return res.status(200).json({
            success: true,
            message: "Usuário logado com sucesso",
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                tipo_conta: usuario.tipo_conta,
                endereco: usuario.endereco,
                cpf: usuario.cpf,
                telefone: usuario.telefone
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

// ==========================================
// Função para login de usuário por CPF
// ==========================================
export const loginUsuarioCpf = async (req, res) => {
    try {
        // Pega o CPF e a senha digitados pelo usuário
        const { cpf, senha } = req.body;

        // Verifica se os dados foram preenchidos
        if (!cpf || !senha) {
            return res.status(400).json({
                success: false,
                message: "Informe o CPF e senha."
            });
        }

        // Busca no banco de dados se existe algum usuário com esse CPF
        const [rows] = await db.query("SELECT * FROM usuarios WHERE cpf = ?", [cpf]);

        // Se não encontrar nenhum usuário, retorna erro
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciais inválidas.", success: false });
        }

        const usuario = rows[0];

        // Verifica se a senha informada bate com o hash salvo no banco
        if (!(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ message: "Credenciais inválidas", success: false });
        }

        // Logado com sucesso, retorna as informações do usuário
        return res.status(200).json({
            success: true,
            message: "Usuário logado com sucesso",
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                tipo_conta: usuario.tipo_conta,
                endereco: usuario.endereco,
                cpf: usuario.cpf,
                telefone: usuario.telefone
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

// ==========================================
// Função para redefinir a senha do usuário
// ==========================================
export const esqueciSenha = async (req, res) => {
    try {
        // Captura o email e as novas senhas informadas
        const email = req.body.email;
        const senha = req.body.novaSenha;
        const confirmar_senha = req.body.confirmarSenha;

        // Validação de segurança: o e-mail não pode estar vazio
        if (email === "") {
            return res.status(400).json({ message: "Email não deve estar vazio. Ele é obrigatório.", success: false })
        }

        // Valida se a senha está vazia ou fora do tamanho permitido (6 a 12 caracteres)
        if (senha === "") {
            return res.status(400).json({ message: "Senha não deve estar vazio. Ela é obrigatório.", success: false })
        } else {
            if (senha.length < 6 || senha.length > 12) {
                return res.status(400).json({ message: "A senha deve somente de 6 a 12 caracteres.", success: false })
            };
        };

        // Valida a confirmação da senha e checa se bate com a nova senha digitada
        if (confirmar_senha === "") {
            return res.status(400).json({ message: "O campo confirmar senha é obrigatório. Não deve estar vazio.", success: false })
        } else {
            if (confirmar_senha !== senha) {
                return res.status(400).json({ message: "O campo confirmar senha não é igual a senha. Tente novamente.", success: false })
            };
            
            // Valida a nova senha contra as regras de senha forte (Regex)
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
            if (!regex.test(senha)) {
                return res.status(400).json({ message: "A senha não corresponde as regras impostas para uma senha forte", success: false })
            };
        };

        // Busca apenas o ID do usuário usando o e-mail fornecido
        const [row] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);

        // Se a busca voltar vazia, o e-mail não está cadastrado
        if (row.length === 0) {
            return res.status(400).json({ message: "Esse usuário não foi encontrado", success: false })
        }

        const user = row[0];
        const saltRound = 10;
        
        // Criptografa a NOVA senha antes de atualizar no banco
        const hashPassword = await bcrypt.hash(senha, saltRound);

        // Atualiza a coluna 'senha' do usuário especifico (usando o ID)
        const [result] = await db.query("UPDATE usuarios SET senha = ? WHERE id = ?", [hashPassword, user.id]);

        // Verifica se a atualização afetou alguma linha (se não afetou, algo deu errado)
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Não foi possivel resetar a sua senha. Tente novamente.", success: false })
        }

        // Tudo ocorreu bem, a senha foi atualizada
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