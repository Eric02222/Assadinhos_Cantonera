import { api } from "./api.js";

export async function getLanches() {
    try {
        const res = await api.get('/lanche');
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar lanches', error);
        throw error;
    }
}

export async function getLancheById(id) {
    try {
        const res = await api.get(`/lanche/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar lanche por ID', error);
        throw error;
    }
}

export async function createLanche(data) {
    try {
        const res = await api.post('/lanche', data);
        return res.data;
    } catch (error) {
        console.error('Erro ao criar lanche', error);
        throw error;
    }
}

export async function updateLanche(id, data) {
    try {
        const res = await api.patch(`/lanche/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Erro ao editar lanche', error);
        throw error;
    }
}

export async function deleteLanche(id, data) {
    try {
        const res = await api.delete(`/lanche/${id}`, { data });
        return res.data;
    } catch (error) {
        console.error('Erro ao excluir lanche', error);
        throw error;
    }
}
