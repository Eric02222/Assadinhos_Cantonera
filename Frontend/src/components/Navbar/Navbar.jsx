import { Link } from "react-router";
import { useAuth } from "../../context/Context";
import { useState } from "react";
import { MdWbSunny } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import CartModal from "../Cart/CartModal";

function Navbar() {
  const { user, logout, cart, theme, toggleTheme } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantidadeNoCarrinho, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Histórico", path: "/historico" },
    ...(user?.tipo_conta === 0 ? [{ name: "Pedidos", path: "/pedidos" }] : []),
    ...(user?.tipo_conta === 1 ? [{name: "Lista Usuários", path: "/listaUsuarios"}] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-red-500 tracking-tighter">
              ASSADINHOS <span className="text-gray-800 dark:text-gray-100">CANTONERA</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 dark:text-gray-300 font-semibold hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-6">
                {user?.tipo_conta === 0 && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    {/* Substituído o emoji pelo ícone AiOutlineShoppingCart */}
                    <span className="font-semibold flex items-center gap-1.5">
                      Carrinho <AiOutlineShoppingCart className="text-xl" />
                    </span>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                )}

                <div className="relative flex items-center gap-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Olá, <span className="text-gray-800 dark:text-gray-100 font-bold">{user.nome}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
                      <Link
                        to="/perfil"
                        onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                      >
                        {/* Adicionado o ícone FaUser */}
                        <FaUser className="text-gray-400" /> Perfil
                      </Link>
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                      >
                        {/* Substituídos os emojis pelos ícones FaMoon e MdWbSunny */}
                        {theme === "light" ? (
                          <>
                            <FaMoon className="text-gray-400" /> Modo Escuro
                          </>
                        ) : (
                          <>
                            <MdWbSunny className="text-yellow-500" /> Modo Claro
                          </>
                        )}
                      </button>
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 font-semibold hover:text-red-500 transition-colors px-4">Login</Link>
                <Link
                  to="/cadastro"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-all"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-black text-red-500">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {link.name}
                </Link>
              ))}
              {user?.tipo_conta === 0 && (
                <button
                  onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-lg font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left flex items-center justify-between w-full"
                >
                  {/* Substituído o emoji do carrinho no mobile */}
                  <span className="flex items-center gap-2">
                    Carrinho <AiOutlineShoppingCart className="text-xl" />
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-sm">{cartItemsCount}</span>
                </button>
              )}
            </div>

            <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Olá, <span className="font-bold text-gray-800 dark:text-gray-100">{user.nome}</span>
                  </div>
                  <Link
                    to="/perfil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800"
                  >
                    {/* Adicionado o ícone FaUser no mobile */}
                    <FaUser /> Perfil
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold transition-colors"
                  >
                    <span>Modo Alternar</span>
                    {/* Substituídos os emojis do tema no mobile */}
                    {theme === "light" ? (
                      <span className="flex items-center gap-1.5 text-sm font-normal"><FaMoon /> Escuro</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm font-normal"><MdWbSunny className="text-yellow-500" /> Claro</span>
                    )}
                  </button>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-4 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/cadastro"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-4 py-3 rounded-xl font-bold bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-none transition-all"
                  >
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}

export default Navbar;