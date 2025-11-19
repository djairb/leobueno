import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GraduationCap, AlertTriangle, CheckCircle, ClipboardList } from 'lucide-react'; // Adicionei ClipboardList
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../infra/apiConfig';

export default function RelatorioTurma() {
  const [turmas, setTurmas] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [data, setData] = useState(null);

  const COLORS = { 'Presente': '#059669', 'Ausente': '#DC2626', 'Justificado': '#D97706' };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/turmas`).then(res => setTurmas(res.data));
  }, []);

  useEffect(() => {
    if (selectedTurma) {
      axios.get(`${API_BASE_URL}/relatorios/turma/${selectedTurma}`)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedTurma]);

  const chartData = data?.stats.map(item => ({
    name: item.status,
    value: item.total
  })) || [];

  // Verificação se tem dados reais
  const temDados = data && data.stats && data.stats.length > 0;

  return (
    <div className="p-6 md:p-8 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <GraduationCap className="text-logoenf" /> Desempenho da Turma
      </h1>

      {/* Seletor */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Selecione a Turma</label>
        <select 
            className="w-full md:w-1/2 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-logoenf"
            value={selectedTurma}
            onChange={(e) => setSelectedTurma(e.target.value)}
        >
            <option value="">Escolha...</option>
            {turmas.map(t => <option key={t.id} value={t.id}>{t.codigo} - {t.nome_curso}</option>)}
        </select>
      </div>

      {/* Conteúdo Condicional */}
      {selectedTurma && !data && <p className="text-center text-gray-500">Carregando dados...</p>}

      {selectedTurma && data && !temDados && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <ClipboardList size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-600">Nenhuma chamada registrada</h3>
            <p className="text-gray-400 mb-6 text-sm">Esta turma ainda não possui histórico de frequência.</p>
            <Link to="/chamada" className="text-logoenf font-bold hover:underline">
                Realizar primeira chamada &rarr;
            </Link>
        </div>
      )}

      {temDados && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. GRÁFICO */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1 flex flex-col items-center">
                <h3 className="font-bold text-gray-700 mb-4">Presença Geral</h3>
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

            {/* 2. LISTA DE ALUNOS */}
            <div className="lg:col-span-2">
                <h3 className="font-bold text-gray-700 mb-4">Desempenho Individual</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.alunos.map(aluno => (
                        <Link 
                            to={`/relatorios/aluno/${aluno.id}/turma/${selectedTurma}`} 
                            key={aluno.id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-logoenf flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                                    {aluno.nome.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 group-hover:text-logoenf transition-colors">{aluno.nome}</p>
                                    <p className="text-xs text-gray-500">CPF: {aluno.cpf}</p>
                                </div>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                aluno.percentual >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {aluno.percentual >= 75 ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                                {aluno.percentual}%
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}