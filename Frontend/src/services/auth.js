import { api } from "./api.js"

export async function cadastrarUser(data) {
    try {
        const res = await api.post('/cadastrar', data)
        return res.data
    } catch (error) {
        console.error('Erro ao cadastrar', error)
        throw error
    }
}


export async function loginUserEmail(data) {
    try {
        const res = await api.post('/login/email', data)
        return res.data
    } catch (error) {
        console.error('Erro ao logar com email', error)
        throw error
    }
}

export async function loginUserCpf(data) {
    try {
        const res = await api.post('/login/cpf', data)
        return res.data
    } catch (error) {
        console.error('Erro ao logar com CPF', error)
        throw error
    }
}

export async function esqueciSenha(data) {
    try {
        const res = await api.post('/login/esqueciSenha', data);
        return res.data;
    } catch (error) {
        console.log('Erro ao recuperar senha', error)
    }

}