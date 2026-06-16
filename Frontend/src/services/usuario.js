import { api } from "./api.js";

export async function getUsuarios() {
    try {
        const res = await api.get('/usuario');
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar usuários', error);
        throw error;
    }
}

export async function getUsuarioById(id) {
    try {
        const res = await api.get(`/usuario/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar usuário por ID', error);
        throw error;
    }
}

export async function getUsuarioByEmail(email) {
    try {
        const res = await api.get(`/usuario/email/${email}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao buscar usuário por email', error);
        throw error;
    }
}

export async function createUsuario(data) {
    try {
        const res = await api.post('/usuario', data);
        return res.data;
    } catch (error) {
        console.error('Erro ao criar usuário', error);
        throw error;
    }
}

export async function updateUsuario(id, data) {
    try {
        const res = await api.patch(`/usuario/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Erro ao editar usuário', error);
        throw error;
    }
}

export async function deleteUsuario(id) {
    try {
        const res = await api.delete(`/usuario/${id}`);
        return res.data;
    } catch (error) {
        console.error('Erro ao excluir usuário', error);
        throw error;
    }
}
