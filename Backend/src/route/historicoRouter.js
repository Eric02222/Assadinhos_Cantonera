import express from "express";
import { createHistorico, getHistorico, getHistoricoByUsuario, editarHistorico, excluirHistorico } from "../controller/historico.controller.js";

const routerHistorico = express.Router();

routerHistorico.post("/historico", createHistorico);
routerHistorico.get("/historico", getHistorico);
routerHistorico.get("/historico/usuario/:usuarioId", getHistoricoByUsuario);
routerHistorico.patch("/historico/:id", editarHistorico);
routerHistorico.delete("/historico/:id", excluirHistorico);

export default routerHistorico;
