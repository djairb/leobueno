import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Calendar, ArrowLeft, Filter } from 'lucide-react';
import { API_BASE_URL } from '../infra/apiConfig';

export default function ListaAulas() {
  const [aulas, setAulas] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/aulas`)
      .then(res => {
        setAulas(res.data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  // Filtragem simples no front-end
  const aulasFiltradas = aulas.filter(aula => 
    aula.turma.toLowerCase().includes(busca.toLowerCase()) ||
    aula.disciplina.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 min-h-full font-sans">
      
      <div className="flex items-center justify-between mb-6">
        <div>
            <Link to="/" className="flex items-center text-gray-500 hover:text-green-600 mb-2 text-sm">
                <ArrowLeft size={16} className="mr-1"/> Voltar ao Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-green-600" /> Histórico de Aulas
            </h1>
        </div>
        
        {/* Atalho pra nova aula */}
        <Link to="/chamada" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md">
            + Nova Aula
        </Link>
      </div>

      {/* Barra de Filtro */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input 
            type="text" 
            placeholder="Filtrar por Turma (ex: ENF-2025) ou Disciplina..." 
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
        />
        {busca && <span className="text-xs text-gray-400 font-medium">Exibindo {aulasFiltradas.length} registros</span>}
      </div>

      {/* Tabela de Aulas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando histórico...</div>
        ) : aulasFiltradas.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
                <Filter size={48} className="mx-auto mb-2 opacity-20" />
                <p>Nenhuma aula encontrada.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Data</th>
                            <th className="p-4">Turma</th>
                            <th className="p-4">Disciplina / Professor</th>
                            <th className="p-4">Conteúdo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {aulasFiltradas.map((aula) => (
                            <tr key={aula.id} className="hover:bg-green-50/30 transition-colors">
                                <td className="p-4 whitespace-nowrap font-mono text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-green-600"/>
                                        {new Date(aula.data_aula).toLocaleDateString('pt-BR')}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="font-bold text-gray-800 block">{aula.turma}</span>
                                    <span className="text-xs text-gray-500">{aula.turno}</span>
                                </td>
                                <td className="p-4">
                                    <span className="font-medium text-gray-800 block">{aula.disciplina}</span>
                                    <span className="text-xs text-gray-500">Prof. {aula.professor}</span>
                                </td>
                                <td className="p-4 text-gray-600 max-w-xs truncate" title={aula.conteudo_ministrado}>
                                    {aula.conteudo_ministrado}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}