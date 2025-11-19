import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, User, Calendar, Inbox } from 'lucide-react'; // Adicionei Inbox
import { API_BASE_URL } from '../infra/apiConfig';

export default function RelatorioAluno() {
  const { id, turmaId } = useParams();
  const [data, setData] = useState(null);

  const COLORS = { 'Presente': '#059669', 'Ausente': '#DC2626', 'Justificado': '#D97706' };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/relatorios/aluno/${id}/turma/${turmaId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [id, turmaId]);

  if (!data) return <div className="p-8 text-center text-gray-500">Carregando perfil...</div>;

  // Verificação
  const temHistorico = data.history && data.history.length > 0;
  const chartData = temHistorico ? data.stats.map(item => ({ name: item.status, value: item.total })) : [];

  return (
    <div className="p-6 md:p-8 min-h-full">
      
      <Link to="/relatorios" className="flex items-center text-gray-500 hover:text-logoenf mb-6 w-fit">
        <ArrowLeft size={20} className="mr-2" /> Voltar para Turma
      </Link>

      {/* Info Básica */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
            <User size={32} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{data.aluno.nome}</h1>
            <p className="text-gray-500">CPF: {data.aluno.cpf}</p>
        </div>
      </div>

      {!temHistorico ? (
        // ESTADO VAZIO
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
            <Inbox size={48} className="mb-3 opacity-50" />
            <p className="font-medium">Nenhum registro de frequência encontrado.</p>
            <p className="text-sm">Este aluno ainda não participou de aulas nesta turma.</p>
        </div>
      ) : (
        // CONTEÚDO COM DADOS
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 text-center">Frequência do Aluno</h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Calendar size={18} /> Histórico de Aulas
                    </h3>
                </div>
                <div className="overflow-y-auto max-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 sticky top-0">
                            <tr>
                                <th className="p-4">Data</th>
                                <th className="p-4">Disciplina</th>
                                <th className="p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.history.map((item, i) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="p-4 font-mono text-gray-600">
                                        {new Date(item.data_aula).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{item.disciplina}</td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            item.status === 'Presente' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Ausente' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}