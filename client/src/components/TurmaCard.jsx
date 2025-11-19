import React from 'react';
import { GraduationCap, Calendar, Clock, Users, Pencil, Trash2 } from 'lucide-react';

export default function TurmaCard({ data }) {
  
  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group relative">
      
      {/* Indicador Lateral (Laranja para Turmas) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>

      <div className="p-5 pl-7">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            <GraduationCap size={24} />
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {data.sigla_curso}
          </span>
        </div>

        <h3 className="font-bold text-gray-800 text-xl mb-1">
          {data.codigo}
        </h3>
        <p className="text-sm text-gray-500 font-medium mb-4">{data.nome_curso}</p>
        
        <div className="space-y-2 border-t border-gray-50 pt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-amber-500" />
            <span>Turno: <strong>{data.turno}</strong></span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} className="text-amber-500" />
            <span className="text-xs">
              {formatarData(data.data_inicio)} até {formatarData(data.data_fim)}
            </span>
          </div>
        </div>
      </div>

      {/* Rodapé de Ações */}
      <div className="flex gap-2 p-4 border-t border-gray-50 bg-gray-50">
        <button 
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors text-sm font-medium border border-gray-200 shadow-sm"
          onClick={() => alert('Editar Turma (Em breve)')}
        >
          <Pencil size={16} /> Editar
        </button>
        <button 
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
          onClick={() => alert('Excluir Turma (Em breve)')}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}