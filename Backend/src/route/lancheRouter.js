import { Router } from "express";
import { createLanche, editarLanche, excluirLanche, getLanche, getLanchesById } from "../controller/lanche.controller.js";

const routerLanche = Router();

routerLanche.get("/lanche", getLanche);
routerLanche.get("/lanche/:id", getLanchesById);
routerLanche.post("/lanche", createLanche);
routerLanche.patch("/lanche/:id", editarLanche);
routerLanche.delete("/lanche/:id", excluirLanche)

export default routerLanche; 