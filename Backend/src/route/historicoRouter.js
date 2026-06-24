import express from "express";
import { createHistorico, getHistorico, getHistoricoByUsuario, editarHistorico, excluirHistorico } from "../controller/historico.controller.js";

const routerHistorico = express.Router();


// Rota para cadastrar um novo movimento no historico.
routerHistorico.post("/historico", createHistorico);

// Rota para ver/listar os movimentos no historico.
routerHistorico.get("/historico", getHistorico);

// Rota para ver movimento no historico de um usuario especifico.
routerHistorico.get("/historico/usuario/:usuarioId", getHistoricoByUsuario);

// Rota para atualizar um movimento no historico.
routerHistorico.patch("/historico/:id", editarHistorico);

// Rota para deletar um movimento no historico.
routerHistorico.delete("/historico/:id", excluirHistorico);


export default routerHistorico;