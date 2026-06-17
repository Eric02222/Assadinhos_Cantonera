import { Link } from "react-router";
import { useAuth } from "../../context/Context";
import { useState } from "react";
import CartModal from "../Cart/CartModal";

function Navbar() {
  const { user, logout, cart } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantidadeNoCarrinho, 0);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-red-500 tracking-tighter">
              ASSADINHOS <span className="text-gray-800">CANTONERA</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 font-semibold hover:text-red-500 transition-colors">Home</Link>
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/historico" className="text-gray-600 font-semibold hover:text-red-500 transition-colors">Histórico</Link>
                <Link to="/pedidos" className="text-gray-600 font-semibold hover:text-red-500 transition-colors">Pedidos</Link>
                
                {/* Botão do Carrinho */}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <span className="text-2xl">🛒</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Olá, <span className="text-gray-800 font-bold">{user.nome}</span></span>
                  <button 
                    onClick={logout} 
                    className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-5 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 font-semibold hover:text-red-500 transition-colors px-4">Login</Link>
                <Link 
                  to="/cadastro" 
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 transition-all"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}

export default Navbar;
