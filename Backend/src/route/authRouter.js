import { Router } from "express"
import { esqueciSenha, loginUsuarioCpf, loginUsuarioEmail, novoUsuario } from "../controller/auth.controller.js"

// Inicializa o roteador para começarmos a cadastrar as nossas rotas de autenticação
const routerAuth = Router()

// Rota para cadastrar um novo usuário.
routerAuth.post("/cadastrar", novoUsuario)

// Rota para o usuário fazer login usando o E-MAIL.
routerAuth.post("/login/email", loginUsuarioEmail)

// Rota para o usuário fazer login usando o CPF.
routerAuth.post("/login/cpf", loginUsuarioCpf)

// Rota para o caso do usuário ter esquecido a senha.
routerAuth.post("/login/esqueciSenha", esqueciSenha)

export { routerAuth }