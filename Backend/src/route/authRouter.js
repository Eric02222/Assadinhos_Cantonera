import { Router } from "express"
import {  loginUsuarioCpf, loginUsuarioEmail, novoUsuario } from "../controller/auth.controller.js"

const routerAuth = Router()

routerAuth.post("/cadastrar", novoUsuario)
routerAuth.post("/login/email", loginUsuarioEmail)
routerAuth.post("/login/cpf", loginUsuarioCpf)

export {routerAuth}