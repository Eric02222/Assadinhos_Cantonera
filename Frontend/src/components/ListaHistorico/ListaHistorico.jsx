import React, { useState, useEffect } from 'react';
import { getHistorico } from '../../services/historico';
import { useAuth } from '../../context/Context';
import { toast } from 'react-toastify';

function ListaHistorico() {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchHistorico();
    }, [user]);

    const fetchHistorico = async () => {
        try {
            const data = await getHistorico();
            if (data.success) {
                if (user?.tipo_conta === 1) {
                    setHistorico(data.data);
                } else {
                    const seuHistorico = data.data.filter(h => h.usuarioComprador === user?.id);
                    setHistorico(seuHistorico);
                }
            }
        } catch (err) {
            console.error('Erro ao buscar histórico:', err);
            toast.error('Erro ao carregar histórico.');
        } finally {
            setLoading(false);
        }
    };

    const getAcaoBadgeClass = (acao) => {
        switch (acao) {
            case 'Pedido': return 'bg-blue-100 text-blue-600';
            case 'Edição': return 'bg-yellow-100 text-yellow-600';
            case 'Cancelamento/Exclusão': return 'bg-red-100 text-red-600';
            case 'Entrega Realizada': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) return (
        <div className="text-center py-20 text-gray-500 animate-pulse font-medium">
            Carregando histórico...
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-800">
                    {user?.tipo_conta === 1 ? 'Histórico Geral de Ações' : 'Meu Histórico'}
                </h1>
                <p className="text-gray-500">
                    {user?.tipo_conta === 1 
                        ? 'Auditoria completa de todas as movimentações e ações realizadas no sistema.' 
                        : 'Confira o registro de todas as suas interações e pedidos passados.'}
                </p>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Data/Hora</th>
                                {user?.tipo_conta === 1 && (
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Usuário</th>
                                )}
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Lanche</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Qtd</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Ação</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Endereço</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {historico.length > 0 ? (
                                historico.sort((a, b) => new Date(b.horarioPedido) - new Date(a.horarioPedido)).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(item.horarioPedido).toLocaleString('pt-BR')}
                                        </td>
                                        {user?.tipo_conta === 1 && (
                                            <td className="px-6 py-4 font-bold text-gray-700">{item.usuarioNome}</td>
                                        )}
                                        <td className="px-6 py-4 font-bold text-gray-800">{item.lancheNome}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{item.quantidadePedida} un.</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getAcaoBadgeClass(item.acao)}`}>
                                                {item.acao || 'Pedido'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate" title={item.enderecoPedido}>
                                            {item.enderecoPedido}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={user?.tipo_conta === 1 ? 6 : 5} className="px-6 py-10 text-center text-gray-400">
                                        Nenhum registro encontrado no histórico.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListaHistorico;
