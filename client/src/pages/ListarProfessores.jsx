import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Search, UserRoundX } from 'lucide-react';

// Importando o componente novo
import ProfessorCard from '../components/ProfessorCard';
import { API_BASE_URL } from '../infra/apiConfig';

export default function ListaProfessores() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados (Mesma lógica de antes)
  useEffect(() => {
    axios.get(`${API_BASE_URL}/professores`)
      .then(res => {
        setProfessores(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar professores", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 md:p-8 min-h-full">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Professores</h1>
          <p className="text-gray-500">Gerencie o corpo docente da escola.</p>
        </div>

        <Link 
          to="/professores/novo" 
          className="bg-logoenf hover:bg-logoenf-dark text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-logoenf/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} /> Novo Professor
        </Link>
      </div>

      {/* Barra de Busca (Visual) */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-8 max-w-md flex items-center gap-2">
        <div className="p-2 text-gray-400"><Search size={20} /></div>
        <input 
          type="text" 
          placeholder="Buscar professor..." 
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* --- AQUI ENTRA O GRID DE CARDS --- */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Carregando professores...</p>
      ) : professores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
          <UserRoundX size={48} className="mb-2 opacity-50" />
          <p>Nenhum professor encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {professores.map((prof) => (
            <ProfessorCard key={prof.id} data={prof} />
          ))}
        </div>
      )}
      
    </div>
  );
}