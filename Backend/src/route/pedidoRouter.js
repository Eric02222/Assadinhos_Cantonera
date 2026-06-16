import express from "express";
import { createPedido, getPedidos, getPedidoById, editarPedido, excluirPedido } from "../controller/pedido.controller.js";

const routerPedido = express.Router();

routerPedido.post("/pedido", createPedido);
routerPedido.get("/pedido", getPedidos);
routerPedido.get("/pedido/:id", getPedidoById);
routerPedido.patch("/pedido/:id", editarPedido);
routerPedido.delete("/pedido/:id", excluirPedido);

export default routerPedido;
