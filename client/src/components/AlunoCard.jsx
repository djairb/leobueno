import React from 'react';
import { User, CreditCard, Calendar, Pencil, Trash2 } from 'lucide-react'; // Importamos Pencil e Trash2

export default function AlunoCard({ data }) {
  // Função para formatar a data (se existir)
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informada';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group relative">
      
      {/* Indicador Lateral (Azul para Alunos) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>

      <div className="p-5 pl-7">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            <User size={24} />
          </div>
          {/* Badge de Status (Assumindo ativo se não tiver campo, ou ajuste conforme seu banco) */}
          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
            Ativo
          </span>
        </div>

        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 truncate" title={data.nome}>
          {data.nome}
        </h3>
        
        <div className="space-y-1 mt-3">
          {/* Mostra o CPF */}
          <div className="flex items-center gap-2 text-sm text-gray-500 font-mono bg-gray-50 p-1 rounded w-fit px-2">
            <CreditCard size={14} className="text-gray-400" />
            {data.cpf}
          </div>
          
          {/* Data de Nascimento */}
          <div className="flex items-center gap-2 text-xs text-gray-400 pl-1">
            <Calendar size={12} />
            {formatarData(data.data_nascimento)}
          </div>
        </div>
      </div>

      {/* Rodapé: Ações (Novo) */}
      <div className="flex gap-2 p-5 pt-4 border-t border-gray-50 bg-gray-50">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium border border-gray-200 shadow-sm"
            onClick={() => alert(`Editar ${data.nome} (Funcionalidade em breve)`)}
          >
            <Pencil size={16} /> Editar
          </button>
          
          <button 
            className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
            title="Excluir Aluno"
            onClick={() => alert(`Excluir ${data.nome} (Funcionalidade em breve)`)}
          >
            <Trash2 size={16} />
          </button>
      </div>
    </div>
  );
}