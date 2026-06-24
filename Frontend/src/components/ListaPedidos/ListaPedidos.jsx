import React, { useState, useEffect } from 'react';
import { getPedidos, updatePedido, deletePedido, confirmarEntrega } from '../../services/pedido';
import { useAuth } from '../../context/Context';
import Modal from '../Modal/Modal';
import { toast } from 'react-toastify';

/**
 * Componente ListaPedidos
 * Responsável por listar os pedidos realizados.
 * Permite editar, cancelar ou confirmar a entrega de um pedido.
 */
function ListaPedidos() {
    // Estados para gerenciar a lista de pedidos, carregamento e modais de ação
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPedido, setEditingPedido] = useState(null);
    const [formData, setFormData] = useState({
        lanchePedido: '',
        quantidadePedida: '',
        enderecoPedido: '',
        usuarioComprador: ''
    });
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [pedidoToCancel, setPedidoToCancel] = useState(null);
    const { user } = useAuth(); // Contexto de autenticação

    // Busca pedidos ao carregar o componente ou alterar o usuário
    useEffect(() => {
        fetchPedidos();
    }, [user]);

    // Busca todos os pedidos e filtra de acordo com o tipo de conta do usuário
    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            if (data.success) {

                if (user?.tipo_conta === 1) {
                    setPedidos(data.data); // Admin vê todos
                } else {
                    const seusPedidos = data.data.filter(p => p.usuarioComprador === user?.id);
                    setPedidos(seusPedidos); // Cliente vê apenas os próprios
                }
            }
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            toast.error('Erro ao carregar pedidos.');
        } finally {
            setLoading(false);
        }
    };

    // Abre modal de edição preenchido com dados do pedido
    const handleOpenModal = (pedido) => {
        setEditingPedido(pedido);
        setFormData({
            lanchePedido: pedido.lanchePedido,
            quantidadePedida: pedido.quantidadePedida,
            enderecoPedido: pedido.enderecoPedido,
            usuarioComprador: pedido.usuarioComprador
        });
        setIsModalOpen(true);
    };

    // Gerencia mudanças no formulário de edição
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Salva a edição do pedido via API
    const handleSave = async () => {
        try {
            const res = await updatePedido(editingPedido.id, formData);
            if (res.success) {
                toast.success('Pedido atualizado com sucesso!');
                setIsModalOpen(false);
                fetchPedidos(); // Atualiza a lista após salvar
            } else {
                toast.error(res.message || 'Erro ao atualizar pedido.');
            }
        } catch (err) {
            toast.error('Erro ao salvar alterações.');
        }
    };

    // Abre modal de confirmação para cancelamento
    const handleDelete = (pedido) => {
        setPedidoToCancel(pedido);
        setIsCancelModalOpen(true);
    };

    // Confirma e processa o cancelamento via API
    const confirmDelete = async () => {
        if (!pedidoToCancel) return;
        try {
            const res = await deletePedido(pedidoToCancel.id);
            if (res.success) {
                toast.success('Pedido cancelado com sucesso!');
                fetchPedidos(); // Atualiza a lista após cancelar
            } else {
                toast.error(res.message || 'Erro ao cancelar pedido.');
            }
        } catch (err) {
            toast.error('Erro ao excluir pedido.');
        } finally {
            setIsCancelModalOpen(false);
            setPedidoToCancel(null);
        }
    };

    // Confirma entrega do pedido via API
    const handleConfirmarEntrega = async (id) => {
        try {
            const res = await confirmarEntrega(id);
            if (res.success) {
                toast.success('Entrega confirmada!');
                fetchPedidos(); // Atualiza a lista após confirmação
            } else {
                toast.error(res.message || 'Erro ao confirmar entrega.');
            }
        } catch (err) {
            toast.error('Erro ao confirmar entrega.');
        }
    };

    // Exibe loading durante a busca
    if (loading) return (
        <div className="text-center py-20 text-gray-500 animate-pulse font-medium">
            Carregando pedidos...
        </div>
    );

    return (
        <div className="space-y-6 transition-colors duration-300">
            {/* Cabeçalho dinâmico baseado no usuário */}
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">
                    {user?.tipo_conta === 1 ? 'Gerenciamento de Pedidos' : 'Meus Pedidos'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {user?.tipo_conta === 1 
                        ? 'Visualize e gerencie todos os pedidos realizados na plataforma.' 
                        : 'Acompanhe e gerencie seus pedidos realizados.'}
                </p>
            </header>

            {/* Tabela de pedidos */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID</th>
                                {user?.tipo_conta === 1 && (
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente</th>
                                )}
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Lanche</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Qtd</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Endereço</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Data/Hora</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {pedidos.length > 0 ? (
                                pedidos.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">#{pedido.id}</td>
                                        {user?.tipo_conta === 1 && (
                                            <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">{pedido.usuarioNome}</td>
                                        )}
                                        <td className="px-6 py-4 font-bold text-red-500">{pedido.lancheNome}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">{pedido.quantidadePedida} un.</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs truncate">{pedido.enderecoPedido}</td>
                                        <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs">
                                            {new Date(pedido.horarioPedido).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button 
                                                onClick={() => handleConfirmarEntrega(pedido.id)}
                                                className="text-green-500 hover:text-green-700 dark:hover:text-green-400 font-bold text-sm transition-colors"
                                                title="Marcar como Entregue"
                                            >
                                                ✅ Entregue
                                            </button>
                                            <button 
                                                onClick={() => handleOpenModal(pedido)}
                                                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-bold text-sm transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(pedido)}
                                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold text-sm transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user?.tipo_conta === 1 ? 7 : 6} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edição */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSave}
                title="Editar Pedido"
                confirmText="Salvar Alterações"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Quantidade</label>
                        <input 
                            name="quantidadePedida"
                            type="number"
                            value={formData.quantidadePedida}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            placeholder="Quantidade"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Endereço de Entrega</label>
                        <textarea 
                            name="enderecoPedido"
                            value={formData.enderecoPedido}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            rows="3"
                            placeholder="Endereço completo"
                        />
                    </div>
                </div>
            </Modal>

            {/* Modal de Cancelamento */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Cancelamento"
                confirmText="Sim, Cancelar Pedido"
                cancelText="Não"
            >
                {pedidoToCancel && (
                    <p className="text-gray-600 dark:text-gray-400">
                        Tem certeza que deseja cancelar o pedido <span className="font-bold text-gray-800 dark:text-gray-200">#{pedidoToCancel.id}</span>
                        (<span className="font-bold text-gray-800 dark:text-gray-200">{pedidoToCancel.lancheNome}</span>)?
                    </p>
                )}
            </Modal>
        </div>
    );
}

export default ListaPedidos;
