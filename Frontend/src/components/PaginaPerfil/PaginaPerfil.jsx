import { useEffect, useState } from 'react';
import { useAuth } from '../../context/Context';
import { updateUsuario, deleteUsuario } from '../../services/usuario';
import Modal from '../Modal/Modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaIdCard,
    FaUserTag,
    FaEdit,
    FaTrashAlt,
    FaCheckCircle
} from 'react-icons/fa';

/**
 * Componente PaginaPerfil
 * Exibe os dados do usuário, permitindo a visualização de informações,
 * edição do perfil e exclusão da conta.
 */
function PaginaPerfil() {
    const { user, setUser, logout, isLoading } = useAuth(); // Contexto de autenticação
    const navigate = useNavigate();

    // Estado do formulário de edição
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        endereco: ''
    });

    //
    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    // Estados para controle de modais
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Formata CPF (000.000.000-00)
    const maskCPF = (value) => {
        const strValue = String(value || '');
        return strValue
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    // Formata Telefone ((00) 00000-0000)
    const maskTelefone = (value) => {
        const strValue = String(value || '');
        return strValue
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    // Gera iniciais para avatar (ex: João Silva -> JS)
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    // Gerencia mudanças nos inputs do formulário de edição
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Abre modal de edição carregando dados atuais do usuário
    const handleOpenEditModal = () => {
        if (user) {
            setFormData({
                nome: user.nome || '',
                email: user.email || '',
                cpf: user.cpf ? String(user.cpf).replace(/\D/g, '') : '',
                telefone: user.telefone ? String(user.telefone).replace(/\D/g, '') : '',
                endereco: user.endereco || ''
            });
            setIsEditModalOpen(true);
        }
    };

    // Salva alterações do perfil na API
    const handleSave = async () => {
        try {
            const submissionData = {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
                telefone: formData.telefone.replace(/\D/g, '')
            };

            const response = await updateUsuario(user.id, submissionData);
            if (response.success) {
                setUser(response.data); // Atualiza usuário no contexto
                toast.success('Perfil atualizado com sucesso!');
            }
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error('Erro ao atualizar perfil');
            console.error(error);
        }
    };

    // Processa exclusão da conta do usuário
    const handleDeleteAccount = async () => {
        try {
            await deleteUsuario(user.id);
            toast.success('Conta excluída com sucesso');
            logout();
            navigate('/login');
        } catch (error) {
            toast.error('Erro ao excluir conta');
            console.error(error);
        }
    };

    // Caso não haja usuário autenticado
    if (!user) {
        return (
            <div className="flex justify-center items-center py-20 text-gray-500 dark:text-gray-400">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                        <FaUser />
                    </div>
                    <p className="font-semibold text-lg">Por favor, faça login para acessar seu perfil.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header: Banner e Info básica */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="h-36 md:h-48 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>

                <div className="relative px-6 pb-6 pt-16 md:px-8 md:pt-20">
                    <div className="absolute -top-12 md:-top-16 left-6 md:left-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-xl">
                            {getInitials(user.nome)}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-gray-100 leading-tight">
                                    {user.nome}
                                </h1>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${user.tipo_conta === 1
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                    : 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                    }`}>
                                    <FaUserTag className="text-xs" />
                                    {user.tipo_conta === 1 ? 'Administrador' : 'Cliente Cantonera'}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-sm md:text-base">
                                <FaEnvelope className="text-gray-400 text-sm" /> {user.email}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleOpenEditModal}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl transition-all shadow-md shadow-red-200 dark:shadow-none hover:-translate-y-0.5 cursor-pointer text-sm"
                            >
                                <FaEdit className="text-xs" />
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Informações e Ações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Coluna principal (Dados) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="p-2 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-xl">
                                <FaUser className="text-sm" />
                            </span>
                            Informações Pessoais
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nome Completo</span>
                                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold text-base md:text-lg">
                                    <FaUser className="text-gray-400 dark:text-gray-500 text-sm shrink-0" />
                                    <span>{user.nome}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">E-mail de Contato</span>
                                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold text-base md:text-lg truncate">
                                    <FaEnvelope className="text-gray-400 dark:text-gray-500 text-sm shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Documento (CPF)</span>
                                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold text-base md:text-lg">
                                    <FaIdCard className="text-gray-400 dark:text-gray-500 text-sm shrink-0" />
                                    <span>{maskCPF(user.cpf || '') || <em className="text-gray-400 text-sm font-normal">Não cadastrado</em>}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Telefone celular</span>
                                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold text-base md:text-lg">
                                    <FaPhone className="text-gray-400 dark:text-gray-500 text-sm shrink-0" />
                                    <span>{maskTelefone(user.telefone || '') || <em className="text-gray-400 text-sm font-normal">Não informado</em>}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-500 rounded-xl">
                                <FaMapMarkerAlt className="text-sm" />
                            </span>
                            Endereço de Entrega
                        </h2>

                        <div className="flex items-start gap-4">
                            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 rounded-2xl shrink-0">
                                <FaMapMarkerAlt className="text-2xl" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Endereço Principal</span>
                                <p className={`text-base md:text-lg font-semibold leading-relaxed ${user.endereco ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 font-normal'}`}>
                                    {user.endereco || 'Nenhum endereço de entrega cadastrado ainda.'}
                                </p>
                                {!user.endereco && (
                                    <button
                                        onClick={handleOpenEditModal}
                                        className="mt-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        + Adicionar Endereço
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna lateral (Status e ações destrutivas) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 mb-4">Status da Conta</h3>
                        <div className="flex items-center gap-3.5 p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl text-green-600 dark:text-green-400 mb-4">
                            <FaCheckCircle className="text-2xl shrink-0" />
                            <div>
                                <p className="font-extrabold text-sm">Perfil Ativo</p>
                                <p className="text-xs opacity-90">Verificado para pedidos rápidos</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Mantenha suas informações corretas para garantir que as entregas do Assadinhos Cantonera cheguem de forma rápida e segura ao seu destino.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 space-y-4">
                        <div>
                            <h3 className="text-lg font-extrabold text-red-500 dark:text-red-400 mb-1">Zona de Perigo</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                                Se você não quiser mais usar sua conta no Assadinhos Cantonera, pode apagá-la abaixo. Esta ação é definitiva.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full py-3 text-red-500 hover:text-white font-bold border-2 border-red-100 hover:border-red-500 hover:bg-red-500 dark:border-red-950/60 dark:hover:border-red-600 dark:hover:bg-red-600 rounded-2xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                        >
                            <FaTrashAlt className="text-xs" />
                            Excluir minha conta
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal para Editar Perfil */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Perfil"
                onConfirm={handleSave}
                confirmText="Salvar"
                cancelText="Cancelar"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1.5 font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Nome Completo</label>
                        <input
                            name="nome"
                            type="text"
                            value={formData.nome}
                            placeholder="Digite seu nome completo"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block mb-1.5 font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">E-mail</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            placeholder="seuemail@exemplo.com"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1.5 font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">CPF</label>
                            <input
                                name="cpf"
                                type="text"
                                value={maskCPF(formData.cpf)}
                                placeholder="000.000.000-00"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, cpf: val }));
                                }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Telefone</label>
                            <input
                                name="telefone"
                                type="text"
                                value={maskTelefone(formData.telefone)}
                                placeholder="(00) 00000-0000"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData(prev => ({ ...prev, telefone: val }));
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1.5 font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Endereço de Entrega</label>
                        <input
                            name="endereco"
                            type="text"
                            value={formData.endereco}
                            placeholder="Rua, Número, Bairro, Cidade, Estado"
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </Modal>

            {/* Modal para Excluir Conta */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Excluir Conta"
                onConfirm={handleDeleteAccount}
                confirmText="Excluir Conta"
                cancelText="Manter Conta"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                        <FaTrashAlt />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Tem certeza que deseja excluir sua conta? <br />
                        <span className="text-sm text-red-500 dark:text-red-400 font-semibold block mt-2">
                            Esta ação é irreversível e todos os seus dados e histórico serão apagados permanentemente.
                        </span>
                    </p>
                </div>
            </Modal>
        </div>
    );
}

export default PaginaPerfil;
