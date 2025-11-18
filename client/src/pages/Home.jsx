import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  Clock, 
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

// MOCK DATA: Dados fictícios para preencher a tela
const DASHBOARD_DATA = {
  resumo: [
    { titulo: 'Alunos Ativos', valor: '1.240', icone: <Users size={24} />, cor: 'bg-blue-100 text-blue-600' },
    { titulo: 'Turmas Hoje', valor: '08', icone: <GraduationCap size={24} />, cor: 'bg-logoenf-light/20 text-logoenf' },
    { titulo: 'Frequência Média', valor: '94%', icone: <Activity size={24} />, cor: 'bg-green-100 text-green-600' },
  ],
  aulasHoje: [
    { 
      id: 1, 
      disciplina: 'Anatomia Humana I', 
      turma: 'ENF-2025.1 (Manhã)', 
      sala: 'Lab. 03', 
      horario: '08:00 - 11:40', 
      status: 'Em andamento',
      professor: 'Dr. João Silva'
    },
    { 
      id: 2, 
      disciplina: 'Ética Profissional', 
      turma: 'ENF-2024.2 (Noite)', 
      sala: 'Sala 104', 
      horario: '19:00 - 22:00', 
      status: 'Agendada',
      professor: 'Enf. Ana Costa'
    },
    { 
      id: 3, 
      disciplina: 'Farmacologia Básica', 
      turma: 'ENF-2025.1 (Tarde)', 
      sala: 'Sala 201', 
      horario: '13:30 - 17:00', 
      status: 'Agendada',
      professor: 'Dr. Carlos Santos'
    },
  ]
};

export default function Home() {
  return (
    <div className="p-6 md:p-8 bg-gray-50/50 min-h-full font-sans">
      
      {/* Cabeçalho de Boas-vindas */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Olá, <span className="text-logoenf">Coordenador!</span>
        </h1>
        <p className="text-gray-500 mt-1">Aqui está o resumo das atividades do curso de Enfermagem hoje.</p>
      </div>

      {/* 1. Cards de KPI (Resumo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {DASHBOARD_DATA.resumo.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`p-4 rounded-full ${item.cor}`}>
              {item.icone}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.titulo}</p>
              <h3 className="text-2xl font-bold text-gray-800">{item.valor}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Seção Principal: Aulas do Dia */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarCheck className="text-logoenf" size={22} />
          Aulas Agendadas (Hoje)
        </h2>
        <button className="text-sm text-logoenf font-semibold hover:underline">Ver agenda completa</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {DASHBOARD_DATA.aulasHoje.map((aula) => (
          <div key={aula.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            
            {/* Barra Colorida do Card */}
            <div className={`h-2 w-full ${aula.status === 'Em andamento' ? 'bg-green-500' : 'bg-logoenf'}`}></div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {aula.sala}
                </span>
                {aula.status === 'Em andamento' && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-1">{aula.disciplina}</h3>
              <p className="text-sm text-gray-500 mb-4">{aula.turma}</p>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Clock size={16} className="text-logoenf" />
                  {aula.horario}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Users size={16} className="text-logoenf" />
                  {aula.professor}
                </div>
              </div>
              
              {/* Ação Principal: Ir para Chamada */}
              <Link 
                to="/chamada" 
                className="mt-6 w-full bg-logoenf/10 hover:bg-logoenf text-logoenf-dark hover:text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm flex items-center justify-center gap-2 group"
              >
                Realizar Chamada
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}