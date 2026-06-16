import { Router } from "express";
import { createUser, editarUsuario, getUsuarioByEmail, excluirUsuario, getUsuarioById, getUsuarios } from "../../controller/controllerUsuario/controllerUsuario.js";

const routerUsuario = Router();

routerUsuario.get("/usuario", getUsuarios);
routerUsuario.get("/usuario/:id", getUsuarioById);
routerUsuario.get("/usuario/email/:email", getUsuarioByEmail);
routerUsuario.post("/usuario", createUser);
routerUsuario.patch("/usuario/:id", editarUsuario);
routerUsuario.delete("/usuario/:id", excluirUsuario)

export default routerUsuario; 