import React from 'react';
const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar" }) => {
  // Retorna nulo se o modal não estiver aberto
  if (!isOpen) return null;

  return (
    // Overlay de fundo com blur
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
      {/* Container do modal */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>
        
        {/* Conteúdo dinâmico */}
        <div className="mb-8">
          {children}
        </div>

        {/* Rodapé com botões de ação */}
        <div className="flex gap-4">
          <button 
            className="flex-1 py-4 border-2 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className="flex-[2] py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 dark:shadow-none transition-all"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
