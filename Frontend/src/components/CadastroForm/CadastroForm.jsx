import React, { useState } from 'react';
import { cadastrarUser } from '../../services/auth';
import { Link, useNavigate } from "react-router"
import { toast } from 'react-toastify';

function CadastroForm() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        cpf: '',
        endereco: '',
        telefone: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskTelefone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'cpf') value = maskCPF(value);
        if (name === 'telefone') value = maskTelefone(value);

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

        if (!regex.test(formData.senha) || !regex.test(formData.confirmarSenha)) {
            setError('A senha deve conter 6 a 12 caracteres, uma letra maiúscula e minuscula, número e caractere especial');
            return;
        };

        try {
            const submissionData = {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
                telefone: formData.telefone.replace(/\D/g, '')
            };
            delete submissionData.confirmarSenha;

            const data = await cadastrarUser(submissionData);
            if (data.success) {
                toast.success('Cadastro realizado com sucesso!');
                navigate('/login');
            } else {
                setError(data.message || 'Erro ao realizar cadastro');
            }
        } catch (err) {
            console.log('Falha na conexão com o servidor', err);
        }
    };

    return (
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="mb-6 text-gray-800 text-center text-2xl font-bold">Criar Conta</h2>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-md mb-5 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-600 text-sm">Nome Completo</label>
                    <input
                        name="nome"
                        type="text"
                        placeholder="Seu nome"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-600 text-sm">E-mail</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Seu e-mail"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 text-sm">CPF</label>
                        <input
                            name="cpf"
                            type="text"
                            value={formData.cpf}
                            placeholder="000.000.000-00"
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 text-sm">Telefone</label>
                        <input
                            name="telefone"
                            type="text"
                            value={formData.telefone}
                            placeholder="(00) 00000-0000"
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 text-sm">Senha</label>
                        <input
                            name="senha"
                            type="password"
                            placeholder="Sua senha"
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 text-sm">Confirmar Senha</label>
                        <input
                            name="confirmarSenha"
                            type="password"
                            placeholder="Repita a senha"
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-600 text-sm">Endereço</label>
                    <input
                        name="endereco"
                        type="text"
                        placeholder="Seu endereço"
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors mt-2 shadow-md">
                    Cadastrar
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Já tem uma conta? <Link to="/login" className="text-red-500 font-semibold hover:underline">Entrar</Link>
            </div>
        </div>
    );
}

export default CadastroForm;
