import express from "express";
import { createPedido, getPedidos, getPedidoById, editarPedido, excluirPedido, confirmarEntrega } from "../controller/pedido.controller.js";

const routerPedido = express.Router();

routerPedido.get("/pedido", getPedidos);
routerPedido.get("/pedido/:id", getPedidoById);
routerPedido.post("/pedido", createPedido);
routerPedido.patch("/pedido/:id", editarPedido);
routerPedido.delete("/pedido/:id", excluirPedido);
routerPedido.post("/pedido/confirmar/:id", confirmarEntrega);

export default routerPedido;
