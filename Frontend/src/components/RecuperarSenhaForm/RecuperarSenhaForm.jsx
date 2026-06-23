import { useEffect, useState } from "react"
import { esqueciSenha } from "../../services/auth.js";
import { Link, useNavigate } from "react-router"
import { toast } from 'react-toastify';


function RecuperarSenhaForm() {
    const [form, setForm] = useState({
        email: '',
        novaSenha: '',
        confirmarSenha: ''
    })
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        if (form.novaSenha !== form.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

        if (!regex.test(form.novaSenha) || !regex.test(form.confirmarSenha)) {
            setError('A senha deve conter 6 a 12 caracteres, uma letra maiúscula e minuscula, número e caractere especial');
            return;
        };

        try {
            const ok = await esqueciSenha(form);
            console.log(ok)
            if (ok.success) {
                toast.success('Senha alterada com sucesso!')
                navigate('/login')
            } else {
                setError(ok.message || 'Erro ao redefinir a senha.');
            }
        } catch (error) {
            console.log("Erro ao recuperar senha", error)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300">
            <h2 className="mb-6 text-gray-800 dark:text-gray-100 text-center text-2xl font-bold">Recuperar Senha</h2>

            <form onSubmit={handleChangePassword} className="space-y-4">

                <div>
                    <label htmlFor="senhaRegistro" className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Email</label>
                    <input type="email" id='email' className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder='Digite seu Email' required />
                </div>

                <div>
                    <label htmlFor="senhaRegistro" className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Nova Senha</label>
                    <input type="password" id='senha_nova' className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" value={form.novaSenha} onChange={(e) => setForm({ ...form, novaSenha: e.target.value })} placeholder='Nova Senha' required />
                </div>

                <div>
                    <label htmlFor="senhaRegistro" className="block mb-1 font-semibold text-gray-600 dark:text-gray-400 text-sm">Confirmar Senha</label>
                    <input type="password" id='confirmar_senha' className="w-full p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-base focus:border-red-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" value={form.confirmarSenha} onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })} placeholder='Confirmar Senha' required />
                </div>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 border-b border-t border-gray-100 dark:border-gray-800 pb-6 pt-6">
                    Deseja entrar na sua conta? <Link to="/login" className="text-red-500 font-semibold hover:underline">Entrar</Link>
                </div>

                <button type="submit" className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors mt-2 shadow-md">
                    Recuperar Senha
                </button>
            </form>
        </div>
    )
}

export default RecuperarSenhaForm