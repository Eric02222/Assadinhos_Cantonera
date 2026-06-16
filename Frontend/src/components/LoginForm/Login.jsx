import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUserEmail, loginUserCpf } from '../../services/auth';
import { useAuth } from '../../context/Context';

function LoginForm() {
    const [loginType, setLoginType] = useState('email'); // 'email' or 'cpf'
    const [identifier, setIdentifier] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const handleIdentifierChange = (e) => {
        let value = e.target.value;
        if (loginType === 'cpf') {
            value = maskCPF(value);
        }
        setIdentifier(value);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let data;
            if (loginType === 'email') {
                data = await loginUserEmail({ email: identifier, senha });
            } else {
                const cpfOnlyNumbers = identifier.replace(/\D/g, '');
                data = await loginUserCpf({ cpf: cpfOnlyNumbers, senha });
            }

            if (data.success) {
                login(data.usuario);
                navigate('/');
            } else {
                setError(data.message || 'Erro ao realizar login');
            }
        } catch (err) {
            setError('Falha na conexão com o servidor');
        }
    };

    return (
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="mb-6 text-gray-800 text-center text-2xl font-bold">Entrar no Assadinhos</h2>
            
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button 
                    type="button"
                    onClick={() => { setLoginType('email'); setIdentifier(''); }}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${loginType === 'email' ? 'bg-white shadow text-red-500' : 'text-gray-500'}`}
                >
                    E-mail
                </button>
                <button 
                    type="button"
                    onClick={() => { setLoginType('cpf'); setIdentifier(''); }}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${loginType === 'cpf' ? 'bg-white shadow text-red-500' : 'text-gray-500'}`}
                >
                    CPF
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-md mb-5 text-sm text-center">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-2 font-semibold text-gray-600 text-sm">
                        {loginType === 'email' ? 'E-mail' : 'CPF'}
                    </label>
                    <input 
                        type={loginType === 'email' ? 'email' : 'text'} 
                        placeholder={loginType === 'email' ? 'Seu e-mail' : '000.000.000-00'} 
                        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                        value={identifier}
                        onChange={handleIdentifierChange}
                        required 
                    />
                </div>
                <div>
                    <label className="block mb-2 font-semibold text-gray-600 text-sm">Senha</label>
                    <input 
                        type="password" 
                        placeholder="Sua senha" 
                        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors mt-2 shadow-md">
                    Entrar
                </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500 border-b border-gray-100 pb-6">
                Não tem uma conta? <Link to="/cadastro" className="text-red-500 font-semibold hover:underline">Cadastre-se</Link>
            </div>

            {/* Demonstração */}
            <div className="mt-6">
                <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest mb-4">Acesso para Demonstração</p>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        type="button"
                        onClick={() => handleDemoLogin('client')}
                        className="py-2.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-lg transition-colors border border-gray-100"
                    >
                        Logar Cliente
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleDemoLogin('admin')}
                        className="py-2.5 px-3 bg-gray-800 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                        Logar Admin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
