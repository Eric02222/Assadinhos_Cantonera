import React, { useState } from 'react';
import { useAuth } from '../../context/Context';
import Modal from '../Modal/Modal';
import { createPedido } from '../../services/pedido';
import { toast } from 'react-toastify';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, user, refreshInventory } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [endereco, setEndereco] = useState(user?.endereco || '');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.preco * item.quantidadeNoCarrinho, 0);

  const handleCheckout = async () => {
    if (!endereco) {
      toast.warning('Por favor, informe o endereço de entrega.');
      return;
    }

    if (!isPaymentConfirmed) {
      toast.warning('Por favor, confirme o pagamento.');
      return;
    }

    try {
      const promises = cart.map(item => {
        const pedidoData = {
          lanchePedido: item.id,
          quantidadePedida: item.quantidadeNoCarrinho,
          enderecoPedido: endereco,
          usuarioComprador: user.id
        };
        return createPedido(pedidoData);
      });

      const results = await Promise.all(promises);
      const allSuccess = results.every(res => res.success);

      if (allSuccess) {
        toast.success('Todos os pedidos foram realizados com sucesso!');
        clearCart();
        refreshInventory(); 
        onClose();
        setIsCheckingOut(false);
        setIsPaymentConfirmed(false);
      } else {
        toast.error('Alguns pedidos não puderam ser realizados. Verifique seu histórico.');
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar o pedido.');
    }
  };

  const renderCartItems = () => (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Seu carrinho está vazio.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{item.nome}</h4>
              <p className="text-sm text-gray-500">R$ {parseFloat(item.preco).toFixed(2)} un.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantidadeNoCarrinho - 1))}
                className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex justify-center items-center font-bold hover:bg-red-50"
              >-</button>
              <span className="font-bold w-4 text-center">{item.quantidadeNoCarrinho}</span>
              <button 
                onClick={() => updateCartQuantity(item.id, item.quantidadeNoCarrinho + 1)}
                className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex justify-center items-center font-bold hover:bg-red-50"
              >+</button>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
      {cart.length > 0 && (
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-gray-500 font-bold uppercase text-xs">Total</span>
          <span className="text-2xl font-black text-green-500">R$ {total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );

  const renderCheckoutForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-2">Endereço de Entrega:</label>
        <textarea 
          className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-100 outline-none transition-all text-gray-700 font-medium"
          rows="3"
          placeholder="Digite o endereço completo para entrega..."
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        ></textarea>
      </div>

      <div className="bg-red-50 p-4 rounded-2xl flex items-start gap-3">
        <input 
          type="checkbox" 
          id="confirmPayment" 
          className="mt-1 w-5 h-5 accent-red-500"
          checked={isPaymentConfirmed}
          onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
        />
        <label htmlFor="confirmPayment" className="text-sm text-gray-700 leading-tight cursor-pointer">
          Confirmo que desejo realizar o pagamento de <strong>R$ {total.toFixed(2)}</strong> na entrega (Dinheiro ou Cartão).
        </label>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setIsCheckingOut(false);
      }}
      title={isCheckingOut ? "Finalizar Pedido" : "Meu Carrinho"}
      onConfirm={isCheckingOut ? handleCheckout : () => setIsCheckingOut(true)}
      confirmText={isCheckingOut ? "Confirmar Pedido" : "Checkout"}
      cancelText={isCheckingOut ? "Voltar" : "Fechar"}
    >
      {isCheckingOut ? renderCheckoutForm() : renderCartItems()}
    </Modal>
  );
};

export default CartModal;
