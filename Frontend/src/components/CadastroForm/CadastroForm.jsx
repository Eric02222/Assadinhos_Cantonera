import React, { useState, useEffect } from 'react';
import { cadastrarUser } from '../../services/auth';
import { Link, useNavigate } from "react-router"
import { toast } from 'react-toastify';

/**
 * Componente CadastroForm
 * Responsável por renderizar o formulário de registro de novos usuários,
 * validar os dados inseridos e realizar a chamada para o serviço de autenticação.
 */
function CadastroForm() {
    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        cpf: '',
        endereco: '',
        telefone: ''
    });
    // Estado para gerenciar mensagens de erro
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Efeito para evitar scroll na página durante a exibição do formulário (efeito de modal)
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // Aplica máscara de formatação para CPF
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    // Aplica máscara de formatação para Telefone
    const maskTelefone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    // Gerencia mudanças nos campos do formulário e aplica máscaras
    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === 'cpf') value = maskCPF(value);
        if (name === 'telefone') value = maskTelefone(value);

        setFormData({ ...formData, [name]: value });
    };

    // Processa o envio do formulário, valida senhas e chama a API de cadastro
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validação de senhas iguais
        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        // Validação de complexidade de senha usando regex
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

        if (!regex.test(formData.senha) || !regex.test(formData.confirmarSenha)) {
            setError('A senha deve conter 6 a 12 caracteres, uma letra maiúscula e minuscula, número e caractere especial');
            return;
        };

        try {
            // Limpa máscaras antes de enviar ao backend
            const submissionData = {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
                telefone: formData.telefone.replace(/\D/g, '')
            };
            delete submissionData.confirmarSenha;

            // Chama serviço de cadastro
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
        <div className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300">
            <h2 className="mb-6 text-gray-800 dark:text-gray-100 text-center text-2xl font-bold">Criar Conta</h2>

            {/* Exibição de erros de validação */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Nome Completo</label>
                    <input
                        name="nome"
                        type="text"
                        placeholder="Seu nome"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">E-mail</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Seu e-mail"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">CPF</label>
                        <input
                            name="cpf"
                            type="text"
                            value={formData.cpf}
                            placeholder="000.000.000-00"
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Telefone</label>
                        <input
                            name="telefone"
                            type="text"
                            value={formData.telefone}
                            placeholder="(00) 00000-0000"
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Senha</label>
                        <input
                            name="senha"
                            type="password"
                            placeholder="Sua senha"
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Confirmar Senha</label>
                        <input
                            name="confirmarSenha"
                            type="password"
                            placeholder="Repita a senha"
                            className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Endereço</label>
                    <input
                        name="endereco"
                        type="text"
                        placeholder="Seu endereço"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 border-b border-t border-gray-100 dark:border-gray-800 pb-6 pt-6">
                    Já tem uma conta? <Link to="/login" className="text-red-500 font-semibold hover:underline">Entrar</Link>
                </div>

                <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors mt-2 shadow-md">
                    Cadastrar
                </button>
            </form>
        </div>
    );
}

export default CadastroForm;
