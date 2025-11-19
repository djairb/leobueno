import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Search, UserPlus, UserX } from 'lucide-react';
import AlunoCard from '../components/AlunoCard'; // Importe o Card Novo
import { API_BASE_URL } from '../infra/apiConfig';

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/alunos`)
      .then(res => {
        setAlunos(res.data);
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
          <h1 className="text-2xl font-bold text-gray-800">Alunos Matriculados</h1>
          <p className="text-gray-500">Gestão acadêmica e matrículas.</p>
        </div>

        <div className="flex gap-3"> {/* Criei uma div pra agrupar os botões */}

          {/* Botão de Matrícula (NOVO) */}
          <Link to="/matriculas/nova" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm flex items-center gap-2 text-sm transition-all">
            <UserPlus size={18} /> Matricular
          </Link>

          {/* Botão de Novo Aluno (Já existia) */}
          <Link to="/alunos/novo" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 text-sm transition-all">
            <Plus size={18} /> Novo Aluno
          </Link>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Carregando alunos...</p>
      ) : alunos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
          <UserX size={48} className="mb-2 opacity-50" />
          <p>Nenhum aluno encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {alunos.map((aluno) => (
            <AlunoCard key={aluno.id} data={aluno} />
          ))}
        </div>
      )}
    </div>
  );
}