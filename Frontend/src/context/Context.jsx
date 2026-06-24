import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router';

// Criação do contexto de autenticação e estado global
const AuthContext = createContext();

/**
 * Provider que gerencia o estado global da aplicação:
 * - Autenticação do usuário.
 * - Carrinho de compras.
 * - Tema (Light/Dark).
 * - Sincronização com localStorage.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastOrderTime, setLastOrderTime] = useState(Date.now());
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const navigate = useNavigate();

  // Função para forçar atualização da listagem de pedidos/lanches
  const refreshInventory = () => {
    setLastOrderTime(Date.now());
  };

  // Carrega dados de usuário e carrinho do localStorage ao iniciar
  useEffect(() => {
    const carregarDadosArmazenados = () => {
      const storedUser = localStorage.getItem("user");
      const storedCart = localStorage.getItem("cart");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Erro ao ler dados do usuário:", error);
          localStorage.removeItem("user");
        }
      }

      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (error) {
          console.error("Erro ao ler dados do carrinho:", error);
          localStorage.removeItem("cart");
        }
      }

      setIsLoading(false);
    };
    carregarDadosArmazenados();
  }, []);

  // Aplica classe de tema ao elemento raiz e salva no localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Alterna o tema entre claro e escuro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Define usuário logado e salva no localStorage
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Realiza logout, limpa estado e localStorage
  const logout = () => {
    toast.success('Usuario deslogado com sucesso!');
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login')
  };

  // Adiciona itens ao carrinho e atualiza o localStorage
  const addToCart = (lanche, quantidade) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === lanche.id);
      let newCart;

      if (existingItemIndex > -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantidadeNoCarrinho += quantidade;
      } else {
        newCart = [...prevCart, { ...lanche, quantidadeNoCarrinho: quantidade }];
      }

      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // Remove item do carrinho e atualiza o localStorage
  const removeFromCart = (lancheId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== lancheId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // Atualiza quantidade de um item no carrinho e no localStorage
  const updateCartQuantity = (lancheId, quantidade) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === lancheId ? { ...item, quantidadeNoCarrinho: quantidade } : item
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // Esvazia carrinho e remove do localStorage
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      setUser,  
      login,
      logout,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      lastOrderTime,
      refreshInventory,
      theme,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o acesso ao contexto em componentes
export const useAuth = () => useContext(AuthContext);
