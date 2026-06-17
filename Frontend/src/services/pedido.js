import { api } from "./api.js";

export async function getPedidos() {
    try {
        const res = await api.get('/pedido');
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar pedidos', error);
        throw error;
    }
}

export async function getPedidoById(id) {
    try {
        const res = await api.get(`/pedido/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar pedido por ID', error);
        throw error;
    }
}

export async function createPedido(data) {
    try {
        const res = await api.post('/pedido', data);
        return res.data;
    } catch (error) {
        console.error('Erro ao criar pedido', error);
        throw error;
    }
}

export async function updatePedido(id, data) {
    try {
        const res = await api.patch(`/pedido/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Erro ao editar pedido', error);
        throw error;
    }
}

export async function deletePedido(id) {
    try {
        const res = await api.delete(`/pedido/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao excluir pedido', error);
        throw error;
    }
}

export async function confirmarEntrega(id) {
    try {
        const res = await api.post(`/pedido/confirmar/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao confirmar entrega', error);
        throw error;
    }
}
