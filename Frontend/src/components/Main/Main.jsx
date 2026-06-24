import React, { useState, useEffect } from 'react';
import { getLanches, createLanche, updateLanche, deleteLanche } from '../../services/lanche';
import { useAuth } from '../../context/Context';
import Modal from '../Modal/Modal';
import { toast } from 'react-toastify';

/**
 * Componente Main
 * Exibe a vitrine de produtos (lanches), permitindo aos usuários buscar/filtrar produtos 
 * e adicioná-los ao carrinho. Administradores possuem funções extras de CRUD (cadastrar, editar, excluir).
 */
function Main() {
    // Estados para listagem e filtragem de produtos
    const [lanches, setLanches] = useState([]);
    const [filteredLanches, setFilteredLanches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    
    // Estados para gerenciamento de compra (seleção e quantidade)
    const [selectedLanche, setSelectedLanche] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    
    // Estado de carregamento e contexto de usuário/carrinho
    const [loading, setLoading] = useState(true);
    const { user, addToCart, lastOrderTime } = useAuth();

    // Estados para modais de administrador (CRUD de lanches)
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [editingLanche, setEditingLanche] = useState(null);
    const [adminFormData, setAdminFormData] = useState({
        nome: '',
        preco: '',
        categoria: '',
        quantidade: ''
    });

    // Estados para modal de confirmação de exclusão
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [lancheToDelete, setLancheToDelete] = useState(null);

    // Carrega lanches ao montar ou quando há atualização no histórico de pedidos
    useEffect(() => {
        fetchLanches();
    }, [lastOrderTime]); 

    // Filtra lanches sempre que o termo de busca, categoria ou a lista de lanches mudar
    useEffect(() => {
        filterLanches();
    }, [searchTerm, categoryFilter, lanches]);

    // Busca lista de lanches na API
    const fetchLanches = async () => {
        try {
            const data = await getLanches();
            if (data.success) {
                setLanches(data.data);
            }
        } catch (err) {
            toast.error('Erro ao buscar lanches');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filtra lanches com base no termo de busca e categoria
    const filterLanches = () => {
        let result = lanches;

        if (searchTerm) {
            result = result.filter(lanche => 
                lanche.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter) {
            result = result.filter(lanche => 
                lanche.categoria === categoryFilter
            );
        }

        setFilteredLanches(result);
    };

    // Adiciona lanche ao carrinho do contexto
    const handleAddToCart = () => {
        if (!user) {
            toast.warning('Você precisa estar logado para adicionar ao carrinho.');
            return;
        }

        addToCart(selectedLanche, quantidade);
        toast.success(`${selectedLanche.nome} adicionado ao carrinho!`);
        setSelectedLanche(null);
        setQuantidade(1);
    };

    // Abre o modal administrativo para cadastrar ou editar um lanche
    const handleOpenAdminModal = (lanche = null) => {
        if (lanche) {
            setEditingLanche(lanche);
            setAdminFormData({
                nome: lanche.nome,
                preco: lanche.preco,
                categoria: lanche.categoria,
                quantidade: lanche.quantidade
            });
        } else {
            setEditingLanche(null);
            setAdminFormData({
                nome: '',
                preco: '',
                categoria: '',
                quantidade: ''
            });
        }
        setIsAdminModalOpen(true);
    };

    // Salva ou atualiza um lanche (CRUD administrativo)
    const handleAdminSave = async () => {
        if (!adminFormData.nome || !adminFormData.preco || !adminFormData.categoria || adminFormData.quantidade === '') {
            toast.warning('Preencha todos os campos corretamente.');
            return;
        }

        try {
            const dataToSend = { ...adminFormData, userId: user.id };
            if (editingLanche) {
                await updateLanche(editingLanche.id, dataToSend);
                toast.success('Lanche atualizado com sucesso!');
            } else {
                await createLanche(dataToSend);
                toast.success('Lanche criado com sucesso!');
            }
            setIsAdminModalOpen(false);
            fetchLanches(); // Atualiza lista
        } catch (err) {
            toast.error('Erro ao salvar lanche.');
        }
    };

    // Abre modal para confirmar exclusão
    const handleAdminDelete = (lanche) => {
        setLancheToDelete(lanche);
        setIsDeleteModalOpen(true);
    };

    // Confirma exclusão via API
    const confirmAdminDelete = async () => {
        if (!lancheToDelete) return;

        try {
            await deleteLanche(lancheToDelete.id, { userId: user.id });
            toast.success('Lanche excluído com sucesso!');
            fetchLanches(); // Atualiza lista
        } catch (err) {
            toast.error(`Erro ao excluir lanche: ${err.message}`);
        } finally {
            setIsDeleteModalOpen(false);
            setLancheToDelete(null);
        }
    };

    // Exibe loading
    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="text-xl font-semibold text-gray-600 dark:text-gray-400 animate-pulse">Carregando cardápio...</div>
        </div>
    );

    const isAdmin = user?.tipo_conta === 1;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 transition-colors duration-300">
            {/* Header com título e botão de admin */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-extrabold text-red-500 mb-2 tracking-tight">Assadinhos Cantonera</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400">O melhor lanche da região direto na sua casa!</p>
                </div>
                
                {isAdmin && (
                    <button 
                        onClick={() => handleOpenAdminModal()}
                        className="bg-gray-800 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2"
                    >
                        <span className="text-2xl">+</span> Adicionar Lanche
                    </button>
                )}
            </header>

            {/* Filtros de busca e categoria */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-12 flex flex-col md:flex-row gap-4 transition-colors">
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Pesquisar por nome do lanche..." 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 outline-none transition-all text-gray-700 dark:text-gray-200 font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900 outline-none transition-all text-gray-700 dark:text-gray-200 font-bold appearance-none cursor-pointer"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Todas Categorias</option>
                        <option value="Frito">Frito</option>
                        <option value="Assado">Assado</option>
                        <option value="Bebida">Bebida</option>
                        <option value="Doce">Doce</option>
                    </select>
                </div>
            </div>

            {/* Grid de Lanches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredLanches.length > 0 ? (
                    filteredLanches.map((lanche) => (
                        <div key={lanche.id} className={`bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col ${!lanche.disponivel && !isAdmin ? 'opacity-70 grayscale' : ''}`}>
                            <div className="h-48 bg-red-50 dark:bg-gray-800 flex justify-center items-center text-7xl select-none relative">
                                🍔
                                {!lanche.disponivel && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md">
                                        Esgotado
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{lanche.nome}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{lanche.categoria}</p>
                                
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-2xl font-black text-green-500">R$ {parseFloat(lanche.preco).toFixed(2)}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{lanche.quantidade} un.</span>
                                </div>
                                
                                <div className="mt-auto space-y-3">
                                    {isAdmin ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => handleOpenAdminModal(lanche)}
                                                className="py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleAdminDelete(lanche)}
                                                className="py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 font-bold rounded-xl transition-all"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${lanche.disponivel ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                                            disabled={!lanche.disponivel}
                                            onClick={() => setSelectedLanche(lanche)}
                                        >
                                            {lanche.disponivel ? 'Pedir Agora' : 'Indisponível'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">Nenhum lanche encontrado com esses filtros. 🥪</p>
                    </div>
                )}
            </div>

            {/* Modal para Adicionar ao Carrinho */}
            <Modal 
                isOpen={!!selectedLanche} 
                onClose={() => { setSelectedLanche(null); setQuantidade(1); }}
                onConfirm={handleAddToCart}
                title="Adicionar ao Carrinho"
                confirmText="Adicionar ao Carrinho"
            >
                {selectedLanche && (
                    <>
                        <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl transition-colors">
                            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">{selectedLanche.nome}</h3>
                            <p className="text-gray-500 dark:text-gray-400">Preço unitário: R$ {parseFloat(selectedLanche.preco).toFixed(2)}</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">Quantidade:</label>
                                <div className="flex items-center gap-6">
                                    <button 
                                        className="w-12 h-12 rounded-full border-2 border-red-500 flex justify-center items-center text-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                                    >-</button>
                                    <span className="text-2xl font-black text-gray-800 dark:text-gray-100 w-8 text-center">{quantidade}</span>
                                    <button 
                                        className="w-12 h-12 rounded-full border-2 border-red-500 flex justify-center items-center text-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        onClick={() => {
                                            if (quantidade < selectedLanche.quantidade) {
                                                setQuantidade(quantidade + 1);
                                            } else {
                                                toast.warning(`Quantidade máxima disponível: ${selectedLanche.quantidade}`);
                                            }
                                        }}
                                    >+</button>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total do Pedido</p>
                                <p className="text-4xl font-black text-green-500">R$ {(selectedLanche.preco * quantidade).toFixed(2)}</p>
                            </div>
                        </div>
                    </>
                )}
            </Modal>

            {/* Modal Administrativo (Adicionar/Editar Lanche) */}
            <Modal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                onConfirm={handleAdminSave}
                title={editingLanche ? 'Editar Lanche' : 'Novo Lanche'}
                confirmText={editingLanche ? 'Salvar Alterações' : 'Cadastrar Lanche'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Nome do Lanche</label>
                        <input 
                            name="nome"
                            type="text"
                            value={adminFormData.nome}
                            onChange={(e) => setAdminFormData({...adminFormData, nome: e.target.value})}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            placeholder="Ex: Coxinha de Frango"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Preço (R$)</label>
                            <input 
                                name="preco"
                                type="number"
                                step="0.01"
                                value={adminFormData.preco}
                                onChange={(e) => setAdminFormData({...adminFormData, preco: e.target.value})}
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Quantidade</label>
                            <input 
                                name="quantidade"
                                type="number"
                                value={adminFormData.quantidade}
                                onChange={(e) => setAdminFormData({...adminFormData, quantidade: e.target.value})}
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Categoria</label>
                        <select 
                            name="categoria"
                            value={adminFormData.categoria}
                            onChange={(e) => setAdminFormData({...adminFormData, categoria: e.target.value})}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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

            {/* Modal de confirmação de exclusão */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmAdminDelete}
                title="Confirmar Exclusão"
                confirmText="Sim, Excluir"
                cancelText="Não, Manter"
            >
                {lancheToDelete && (
                    <p className="text-gray-600 dark:text-gray-400">
                        Tem certeza que deseja excluir permanentemente o lanche <span className="font-bold text-gray-800 dark:text-gray-200">"{lancheToDelete.nome}"</span>? 
                        <br />
                        <span className="font-bold text-red-500">Esta ação não pode ser desfeita.</span>
                    </p>
                )}
            </Modal>
        </div>
    );
}


export default Main;
