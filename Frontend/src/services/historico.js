import { api } from "./api.js";

export async function getHistorico() {
    try {
        const res = await api.get('/historico');
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar histórico', error);
        throw error;
    }
}

export async function getHistoricoByUsuario(usuarioId) {
    try {
        const res = await api.get(`/historico/usuario/${usuarioId}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar histórico por usuário', error);
        throw error;
    }
}

export async function createHistorico(data) {
    try {
        const res = await api.post('/historico', data);
        return res.data;
    } catch (error) {
        console.error('Erro ao criar histórico', error);
        throw error;
    }
}

export async function updateHistorico(id, data) {
    try {
        const res = await api.patch(`/historico/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Erro ao editar histórico', error);
        throw error;
    }
}

export async function deleteHistorico(id) {
    try {
        const res = await api.delete(`/historico/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao excluir histórico', error);
        throw error;
    }
}
