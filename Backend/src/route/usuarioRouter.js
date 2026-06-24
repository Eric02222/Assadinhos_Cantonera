import { Router } from "express";
import { createUser, editarUsuario, getUsuarioByEmail, excluirUsuario, getUsuarioById, getUsuarios } from "../controller/usuario.controller.js";

const routerUsuario = Router();

// Rota para visualizar todos os usuários.
routerUsuario.get("/usuario", getUsuarios);

// Rota para visualizar um usuário em especifico por id.
routerUsuario.get("/usuario/:id", getUsuarioById);

// Rota para visualizar um usuário em especifico por email.
routerUsuario.get("/usuario/email/:email", getUsuarioByEmail);

// Rota para cadastrar um novo usuário.
routerUsuario.post("/usuario", createUser);

// Rota para editar um usuário.
routerUsuario.patch("/usuario/:id", editarUsuario);

// Rota para excluir um usuário.
routerUsuario.delete("/usuario/:id", excluirUsuario)

export default routerUsuario; 