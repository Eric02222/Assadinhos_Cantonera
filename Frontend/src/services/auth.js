import { api } from "./api.js"

export async function cadastrarUser(data) {
    try {
        const res = await api.post('/cadastrar', data)
        return res.data
    } catch (error) {
        console.log('Erro ao logar', error)
    }
}


export async function loginUserEmail(data) {
    try {
        const res = await api.post('/login/email', data)
        return res.data
    } catch (error) {
        console.log('Erro ao logar', error)
    }
}

export async function loginUserCpf(data) {
    try {
        const res = await api.post('/login/cpf', data)
        return res.data
    } catch (error) {
        console.log('Erro ao logar', error)
    }
}




