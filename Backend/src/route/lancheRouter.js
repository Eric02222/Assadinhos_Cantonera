import { Router } from "express";
import { createLanche, editarLanche, excluirLanche, getLanche, getLanchesById } from "../controller/lanche.controller.js";

const routerLanche = Router();

// Rota para visualizar todos os lanches.
routerLanche.get("/lanche", getLanche);

// Rota para visualizar um lanche em especifico.
routerLanche.get("/lanche/:id", getLanchesById);

// Rota para cadastrar um novo lanche.
routerLanche.post("/lanche", createLanche);

// Rota para editar um lanche.
routerLanche.patch("/lanche/:id", editarLanche);

// Rota para excluir um lanche.
routerLanche.delete("/lanche/:id", excluirLanche)

export default routerLanche; 