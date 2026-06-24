import express from "express";
import { createPedido, getPedidos, getPedidoById, editarPedido, excluirPedido, confirmarEntrega } from "../controller/pedido.controller.js";

const routerPedido = express.Router();

// Rota para visualizar todos os pedidos.
routerPedido.get("/pedido", getPedidos);

// Rota para visualizar um pedido em especifico.
routerPedido.get("/pedido/:id", getPedidoById);

// Rota para cadastrar um novo pedido.
routerPedido.post("/pedido", createPedido);

// Rota para editar um pedido.
routerPedido.patch("/pedido/:id", editarPedido);

// Rota para excluir um pedido.
routerPedido.delete("/pedido/:id", excluirPedido);

// Rota para confirmar a entrega do pedido e excluir o pedido que foi concluido.
routerPedido.post("/pedido/confirmar/:id", confirmarEntrega);

export default routerPedido;
