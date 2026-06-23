import React, { useState, useEffect } from 'react';
import { getUsuarios, updateUsuario, deleteUsuario } from '../../services/usuario';
import { useAuth } from '../../context/Context';
import Modal from '../Modal/Modal';
import { toast } from 'react-toastify';

function ListagemUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        endereco: ''
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.tipo_conta === 1) {
            fetchUsuarios();
        }
    }, [user]);

    const fetchUsuarios = async () => {
        try {
            const res = await getUsuarios();
            if (res.success) {
                setUsuarios(res.data);
            } else {
                toast.error(res.message || 'Erro ao buscar usuários.');
            }
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
            toast.error('Erro ao carregar usuários.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (usuario) => {
        setEditingUsuario(usuario);
        setFormData({
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
            telefone: usuario.telefone,
            endereco: usuario.endereco
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await updateUsuario(editingUsuario.id, formData);
            if (res.success) {
                toast.success('Usuário atualizado com sucesso!');
                setIsModalOpen(false);
                fetchUsuarios();
            } else {
                toast.error(res.message || 'Erro ao atualizar usuário.');
            }
        } catch (err) {
            toast.error('Erro ao salvar alterações.');
        }
    };

    const handleDeleteClick = (usuario) => {
        setUsuarioToDelete(usuario);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!usuarioToDelete) return;
        try {
            const res = await deleteUsuario(usuarioToDelete.id);
            if (res.success) {
                toast.success('Usuário excluído com sucesso!');
                fetchUsuarios();
            } else {
                toast.error(res.message || 'Erro ao excluir usuário.');
            }
        } catch (err) {
            toast.error('Erro ao excluir usuário.');
        } finally {
            setIsDeleteModalOpen(false);
            setUsuarioToDelete(null);
        }
    };

    if (user?.tipo_conta !== 1) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-4xl font-black text-red-500 mb-4">Acesso Negado</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar usuários.
                </p>
            </div>
        );
    }

    if (loading) return (
        <div className="text-center py-20 text-gray-500 animate-pulse font-medium">
            Carregando usuários...
        </div>
    );

    return (
        <div className="space-y-6 transition-colors duration-300">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100">
                    Gerenciamento de Usuários
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Visualize e gerencie todos os usuários cadastrados no sistema.
                </p>
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nome</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">CPF</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Conta</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">#{usuario.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">{usuario.nome}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{usuario.email}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{usuario.cpf}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${usuario.tipo_conta === 1 ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                {usuario.tipo_conta === 1 ? 'Admin' : 'Cliente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button 
                                                onClick={() => handleOpenModal(usuario)}
                                                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-bold text-sm transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(usuario)}
                                                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold text-sm transition-colors"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                                        Nenhum usuário encontrado.
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
                title="Editar Usuário"
                confirmText="Salvar Alterações"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Nome</label>
                            <input 
                                name="nome"
                                type="text"
                                value={formData.nome}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="Nome completo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Email</label>
                            <input 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">CPF</label>
                            <input 
                                name="cpf"
                                type="text"
                                value={formData.cpf}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="000.000.000-00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Telefone</label>
                            <input 
                                name="telefone"
                                type="text"
                                value={formData.telefone}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Endereço</label>
                        <textarea 
                            name="endereco"
                            value={formData.endereco}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-colors bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                            rows="3"
                            placeholder="Endereço completo"
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
                confirmText="Sim, Excluir Usuário"
                cancelText="Não"
            >
                {usuarioToDelete && (
                    <p className="text-gray-600 dark:text-gray-400">
                        Tem certeza que deseja excluir o usuário <span className="font-bold text-gray-800 dark:text-gray-200">{usuarioToDelete.nome}</span>? Esta ação não pode ser desfeita.
                    </p>
                )}
            </Modal>
        </div>
    );
}

export default ListagemUsuarios;
