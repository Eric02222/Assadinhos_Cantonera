import React, { useState, useEffect } from 'react';
import { getLanches, createLanche, updateLanche, deleteLanche } from '../../services/lanche';
import { useAuth } from '../../context/Context';
import Modal from '../../components/Modal/Modal';

function Pedidos() {
    const [lanches, setLanches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLanche, setEditingLanche] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        preco: '',
        categoria: '',
        quantidade: ''
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchLanches();
    }, []);

    const fetchLanches = async () => {
        try {
            const data = await getLanches();
            if (data.success) {
                setLanches(data.data);
            }
        } catch (err) {
            console.error('Erro ao buscar lanches:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (lanche = null) => {
        if (lanche) {
            setEditingLanche(lanche);
            setFormData({
                nome: lanche.nome,
                preco: lanche.preco,
                categoria: lanche.categoria,
                quantidade: lanche.quantidade
            });
        } else {
            setEditingLanche(null);
            setFormData({
                nome: '',
                preco: '',
                categoria: '',
                quantidade: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (editingLanche) {
                await updateLanche(editingLanche.id, formData);
                alert('Lanche atualizado com sucesso!');
            } else {
                await createLanche(formData);
                alert('Lanche criado com sucesso!');
            }
            setIsModalOpen(false);
            fetchLanches();
        } catch (err) {
            alert('Erro ao salvar lanche.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este lanche?')) {
            try {
                await deleteLanche(id);
                alert('Lanche excluído com sucesso!');
                fetchLanches();
            } catch (err) {
                alert('Erro ao excluir lanche.');
            }
        }
    };

    if (user?.tipo_conta !== 1) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
                    <p className="text-gray-500">Você não tem permissão para acessar esta área.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">Gerenciamento de Cardápio</h1>
                    <p className="text-gray-500">Adicione, edite ou remova lanches do sistema.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 transition-all flex items-center gap-2"
                >
                    <span className="text-xl">+</span> Novo Lanche
                </button>
            </header>

            {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse font-medium">Carregando lanches...</div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nome</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Preço</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estoque</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {lanches.map((lanche) => (
                                <tr key={lanche.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-700">{lanche.nome}</td>
                                    <td className="px-6 py-4 text-gray-500">{lanche.categoria}</td>
                                    <td className="px-6 py-4 font-bold text-green-500">R$ {parseFloat(lanche.preco).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{lanche.quantidade} un.</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${lanche.disponivel ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {lanche.disponivel ? 'Disponível' : 'Indisponível'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button 
                                            onClick={() => handleOpenModal(lanche)}
                                            className="text-blue-500 hover:text-blue-700 font-bold text-sm transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(lanche.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSave}
                title={editingLanche ? 'Editar Lanche' : 'Novo Lanche'}
                confirmText={editingLanche ? 'Salvar Alterações' : 'Cadastrar Lanche'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Nome do Lanche</label>
                        <input 
                            name="nome"
                            type="text"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                            placeholder="Ex: Coxinha de Frango"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Preço (R$)</label>
                            <input 
                                name="preco"
                                type="number"
                                step="0.01"
                                value={formData.preco}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Quantidade</label>
                            <input 
                                name="quantidade"
                                type="number"
                                value={formData.quantidade}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">Categoria</label>
                        <select 
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-white"
                        >
                            <option value="">Selecione...</option>
                            <option value="Frito">Frito</option>
                            <option value="Assado">Assado</option>
                            <option value="Bebida">Bebida</option>
                            <option value="Doce">Doce</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Pedidos;
