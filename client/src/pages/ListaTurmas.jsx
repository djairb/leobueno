import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, GraduationCap } from 'lucide-react';
import TurmaCard from '../components/TurmaCard';
import { API_BASE_URL } from '../infra/apiConfig';

export default function ListaTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/turmas`)
      .then(res => {
        setTurmas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestão de Turmas</h1>
          <p className="text-gray-500">Turmas ativas e seus períodos letivos.</p>
        </div>
        
        {/* Botão leva para cadastro (vamos criar no próximo passo) */}
        <Link 
          to="/turmas/nova" 
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-200 flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Nova Turma
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Carregando turmas...</p>
      ) : turmas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
          <GraduationCap size={48} className="mb-2 opacity-50" />
          <p>Nenhuma turma cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {turmas.map((turma) => (
            <TurmaCard key={turma.id} data={turma} />
          ))}
        </div>
      )}
    </div>
  );
}