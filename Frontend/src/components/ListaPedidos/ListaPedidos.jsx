import React, { useState, useEffect } from 'react';
import { getPedidos, updatePedido, deletePedido, confirmarEntrega } from '../../services/pedido';
import { useAuth } from '../../context/Context';
import Modal from '../Modal/Modal';
import { toast } from 'react-toastify';

function ListaPedidos() {
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
    const { user } = useAuth();

    useEffect(() => {
        fetchPedidos();
    }, [user]);

    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            if (data.success) {
                // Se for admin (tipo_conta === 1), vê todos. 
                // Se for cliente, vê apenas os seus.
                if (user?.tipo_conta === 1) {
                    setPedidos(data.data);
                } else {
                    const seusPedidos = data.data.filter(p => p.usuarioComprador === user?.id);
                    setPedidos(seusPedidos);
                }
            }
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            toast.error('Erro ao carregar pedidos.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await updatePedido(editingPedido.id, formData);
            if (res.success) {
                toast.success('Pedido atualizado com sucesso!');
                setIsModalOpen(false);
                fetchPedidos();
            } else {
                toast.error(res.message || 'Erro ao atualizar pedido.');
            }
        } catch (err) {
            toast.error('Erro ao salvar alterações.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
            try {
                const res = await deletePedido(id);
                if (res.success) {
                    toast.success('Pedido cancelado com sucesso!');
                    fetchPedidos();
                } else {
                    toast.error(res.message || 'Erro ao cancelar pedido.');
                }
            } catch (err) {
                toast.error('Erro ao excluir pedido.');
            }
        }
    };

    const handleConfirmarEntrega = async (id) => {
        try {
            const res = await confirmarEntrega(id);
            if (res.success) {
                toast.success('Entrega confirmada!');
                fetchPedidos();
            } else {
                toast.error(res.message || 'Erro ao confirmar entrega.');
            }
        } catch (err) {
            toast.error('Erro ao confirmar entrega.');
        }
    };

    if (loading) return (
        <div className="text-center py-20 text-gray-500 animate-pulse font-medium">
            Carregando pedidos...
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-800">
                    {user?.tipo_conta === 1 ? 'Gerenciamento de Pedidos' : 'Meus Pedidos'}
                </h1>
                <p className="text-gray-500">
                    {user?.tipo_conta === 1 
                        ? 'Visualize e gerencie todos os pedidos realizados na plataforma.' 
                        : 'Acompanhe e gerencie seus pedidos realizados.'}
                </p>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                {user?.tipo_conta === 1 && (
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                                )}
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Lanche</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Qtd</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Endereço</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data/Hora</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pedidos.length > 0 ? (
                                pedidos.map((pedido) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400">#{pedido.id}</td>
                                        {user?.tipo_conta === 1 && (
                                            <td className="px-6 py-4 font-bold text-gray-700">{pedido.usuarioNome}</td>
                                        )}
                                        <td className="px-6 py-4 font-bold text-red-500">{pedido.lancheNome}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{pedido.quantidadePedida} un.</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{pedido.enderecoPedido}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(pedido.horarioPedido).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button 
                                                onClick={() => handleConfirmarEntrega(pedido.id)}
                                                className="text-green-500 hover:text-green-700 font-bold text-sm transition-colors"
                                                title="Marcar como Entregue"
                                            >
                                                ✅ Entregue
                                            </button>
                                            <button 
                                                onClick={() => handleOpenModal(pedido)}
                                                className="text-blue-500 hover:text-blue-700 font-bold text-sm transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(pedido.id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user?.tipo_conta === 1 ? 7 : 6} className="px-6 py-10 text-center text-gray-400">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSave}
                title="Editar Pedido"
                confirmText="Salvar Alterações"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Quantidade</label>
                        <input 
                            name="quantidadePedida"
                            type="number"
                            value={formData.quantidadePedida}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                            placeholder="Quantidade"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Endereço de Entrega</label>
                        <textarea 
                            name="enderecoPedido"
                            value={formData.enderecoPedido}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                            rows="3"
                            placeholder="Endereço completo"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ListaPedidos;
