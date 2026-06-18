import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [lastOrderTime, setLastOrderTime] = useState(Date.now());

  const refreshInventory = () => {
    setLastOrderTime(Date.now());
  };

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
    };
    carregarDadosArmazenados();
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    toast.success('Usuario deslogado com sucesso!');
    localStorage.removeItem("user");
    setUser(null);
  };

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

  const removeFromCart = (lancheId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== lancheId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (lancheId, quantidade) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.id === lancheId ? { ...item, quantidadeNoCarrinho: quantidade } : item
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      lastOrderTime,
      refreshInventory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);