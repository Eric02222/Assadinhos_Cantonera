import { Link } from 'react-router';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useEffect } from 'react';

/**
 * Componente Error
 * Exibe uma página amigável quando o usuário acessa uma rota inexistente.
 * Possui design responsivo e consistente com o restante da aplicação.
 */
function Error() {

  // Efeito para evitar scroll na página durante a exibição do formulário
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 transition-colors duration-300">
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Ícone de erro */}
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg shadow-red-100 dark:shadow-none">
          <FaExclamationTriangle />
        </div>

        {/* Mensagem de Erro */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-black text-gray-800 dark:text-gray-100">404</h1>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Página não encontrada</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Oops! Parece que você se perdeu no cardápio. Esta página não existe ou foi removida.
          </p>
        </div>

        {/* Botão para voltar */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-red-200 dark:shadow-none hover:-translate-y-0.5"
        >
          <FaHome />
          Voltar ao Cardápio
        </Link>
      </div>
    </div>
  );
}

export default Error;
