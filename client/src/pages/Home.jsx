import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, GraduationCap, UserRound, BookOpen, ArrowRight, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
// Importações dos Gráficos
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { API_BASE_URL } from '../infra/apiConfig';

export default function Home() {
  // Estado dos Cards (Números)
  const [stats, setStats] = useState({ total_alunos: 0, total_professores: 0, total_turmas: 0, total_aulas: 0 });
  
  // Estado dos Gráficos
  const [chartData, setChartData] = useState({ turmas: [], global: [] });

  // Cores para o Gráfico de Pizza
  const COLORS = { 'Presente': '#059669', 'Ausente': '#DC2626', 'Justificado': '#D97706' };

  useEffect(() => {
    // 1. Busca Contadores Gerais
    axios.get(`${API_BASE_URL}/dashboard`)
      .then(res => setStats(res.data))
      .catch(err => console.error("Erro ao carregar stats:", err));
    
    // 2. Busca Dados dos Gráficos
    axios.get(`${API_BASE_URL}/dashboard/dados`)
      .then(res => {
        // Formata dados globais para o gráfico
        const globalData = res.data.graficoGlobal ? res.data.graficoGlobal.map(d => ({ name: d.status, value: d.total })) : [];
        
        setChartData({
            turmas: res.data.graficoTurmas || [],
            global: globalData
        });
      })
      .catch(err => console.error("Erro ao carregar gráficos:", err));
  }, []);

  const cards = [
    { 
      title: 'Alunos Matriculados', 
      value: stats.total_alunos, 
      icon: <Users size={24} />, 
      color: 'bg-blue-100 text-blue-600', 
      link: '/alunos' 
    },
    { 
      title: 'Professores', 
      value: stats.total_professores, 
      icon: <UserRound size={24} />, 
      color: 'bg-purple-100 text-purple-600', 
      link: '/professores' 
    },
    { 
      title: 'Turmas Ativas', 
      value: stats.total_turmas, 
      icon: <GraduationCap size={24} />, 
      color: 'bg-amber-100 text-amber-600', 
      link: '/turmas' 
    },
    { 
      title: 'Aulas Realizadas', 
      value: stats.total_aulas, 
      icon: <BookOpen size={24} />, 
      color: 'bg-green-100 text-green-600', 
      link: '/aulas' // <--- Link atualizado para o Histórico
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-full font-sans">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Visão Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe os indicadores da escola em tempo real.</p>
      </div>

      {/* 1. CARDS DE KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <Link 
            to={card.link} 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>{card.icon}</div>
              <ArrowRight size={16} className="text-gray-300" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 2. ÁREA DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* GRÁFICO DE BARRAS (Comparativo de Turmas) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-logoenf"/> Desempenho por Turma (%)
            </h3>
            <div className="h-80 w-full">
                {chartData.turmas.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.turmas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis domain={[0, 100]} />
                            <RechartsTooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: '#f3f4f6' }}
                            />
                            <Bar dataKey="taxa" name="Presença %" fill="#209E9E" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed rounded-lg">
                        <p>Ainda não há dados suficientes.</p>
                        <small>Realize chamadas para ver o gráfico.</small>
                    </div>
                )}
            </div>
        </div>

        {/* GRÁFICO DE DONUT (Status Global) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <PieIcon size={20} className="text-logoenf"/> Status Global
            </h3>
            <div className="h-80 w-full relative">
                {chartData.global.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={chartData.global} 
                                cx="50%" cy="50%" 
                                innerRadius={60} outerRadius={90} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {chartData.global.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 border border-dashed rounded-lg">
                        <p>Sem registros.</p>
                    </div>
                )}
                
                {/* Texto no meio do Donut */}
                {chartData.global.length > 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-3xl font-bold text-gray-800">
                            {chartData.global.reduce((acc, curr) => acc + curr.value, 0)}
                        </span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Registros</span>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Acesso Rápido */}
      <div className="bg-gradient-to-r from-logoenf to-logoenf-dark rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Pronto para começar o dia?</h2>
          <p className="text-logoenf-light opacity-90">Registre a frequência das aulas de hoje.</p>
        </div>
        <Link 
          to="/chamada" 
          className="bg-white text-logoenf font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-50 transition-colors hover:scale-105 transform duration-200"
        >
          Realizar Chamada Agora
        </Link>
      </div>
    </div>
  );
}