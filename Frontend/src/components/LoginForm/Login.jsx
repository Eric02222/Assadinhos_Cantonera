import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUserEmail, loginUserCpf } from '../../services/auth';
import { useAuth } from '../../context/Context';
import { toast } from 'react-toastify';

/**
 * Componente LoginForm
 * Responsável por renderizar o formulário de login do usuário,
 * permitindo acesso via E-mail ou CPF, e realizar a autenticação via API.
 */
function LoginForm() {
    // Estado para definir o modo de login (email ou cpf)
    const [loginType, setLoginType] = useState('email'); 
    // Estados para os campos do formulário
    const [identifier, setIdentifier] = useState('');
    const [senha, setSenha] = useState('');
    // Estado para mensagens de erro de autenticação
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth(); // Contexto de autenticação

    // Efeito para evitar scroll na página durante a exibição do formulário
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

    // Gerencia mudanças no identificador (email ou CPF com máscara)
    const handleIdentifierChange = (e) => {
        let value = e.target.value;
        if (loginType === 'cpf') {
            value = maskCPF(value);
        }
        setIdentifier(value);
    };

    // Preenche campos com credenciais de demonstração
    const handleDemoLogin = (type) => {
        setLoginType('email');
        if (type === 'admin') {
            setIdentifier('admin@gmail.com');
            setSenha('admin');
        } else {
            setIdentifier('a@gmail.com');
            setSenha('banana');
        }
    };

    // Processa a submissão do formulário de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let data;
            // Realiza login via E-mail ou CPF
            if (loginType === 'email') {
                data = await loginUserEmail({ email: identifier, senha });
            } else {
                const cpfOnlyNumbers = identifier.replace(/\D/g, '');
                data = await loginUserCpf({ cpf: cpfOnlyNumbers, senha });
            }

            // Se sucesso, atualiza o contexto e redireciona
            if (data.success) {
                login(data.usuario);
                toast.success('Login realizado com sucesso!');
                navigate('/');
            } else {
                toast.error('Erro ao Realizar Login!');
                setError(data.message || 'Erro ao realizar login');
            }
        } catch (err) {
            toast.error('Erro ao Realizar Login!');
            setError('Falha na conexão com o servidor');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300 ">
            <h2 className="mb-6 text-gray-800 dark:text-gray-100 text-center text-2xl font-bold">Entrar no Assadinhos</h2>

            {/* Alternância entre modo de login: E-mail ou CPF */}
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => { setLoginType('email'); setIdentifier(''); }}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${loginType === 'email' ? 'bg-white dark:bg-gray-700 shadow text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    E-mail
                </button>
                <button
                    type="button"
                    onClick={() => { setLoginType('cpf'); setIdentifier(''); }}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${loginType === 'cpf' ? 'bg-white dark:bg-gray-700 shadow text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    CPF
                </button>
            </div>

            {/* Exibição de mensagens de erro */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                        {loginType === 'email' ? 'E-mail' : 'CPF'}
                    </label>
                    <input
                        type={loginType === 'email' ? 'email' : 'text'}
                        placeholder={loginType === 'email' ? 'Seu e-mail' : '000.000.000-00'}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        value={identifier}
                        onChange={handleIdentifierChange}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-gray-600 dark:text-gray-400 text-sm">Senha</label>
                    <input
                        type="password"
                        placeholder="Sua senha"
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                {/* Links para cadastro e recuperação de senha */}
                <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-6">
                    Não tem uma conta? <Link to="/cadastro" className="text-red-500 font-semibold hover:underline">Cadastre-se</Link>
                </div>

                <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-6">
                    Esqueceu Sua Senha? <Link to="/esqueceuSenha" className="text-red-500 font-semibold hover:underline">Recuperar</Link>
                </div>

                <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors mt-2 shadow-md">
                    Entrar
                </button>
            </form>

            {/* Acesso para demonstração */}
            <div className="mt-6">
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-4">Acesso para Demonstração</p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleDemoLogin('client')}
                        className="py-2.5 px-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg transition-colors border border-gray-100 dark:border-gray-700"
                    >
                        Logar Cliente
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDemoLogin('admin')}
                        className="py-2.5 px-3 bg-gray-800 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                        Logar Admin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
