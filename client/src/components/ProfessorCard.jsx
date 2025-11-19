import React from 'react';
import { Mail, CreditCard, Pencil, Trash2 } from 'lucide-react';

export default function ProfessorCard({ data }) {
  // Funçãozinha pra pegar as iniciais (Ex: "João Silva" -> "JS")
  const getIniciais = (nome) => {
    const nomes = nome.split(' ');
    return (nomes[0][0] + (nomes.length > 1 ? nomes[nomes.length - 1][0] : '')).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 group">
      
      {/* Cabeçalho Colorido (Opcional, dá um charme) */}
      <div className="h-2 bg-gradient-to-r from-logoenf to-logoenf-dark"></div>

      <div className="p-6">
        
        {/* Header: Avatar + Nome */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 text-logoenf border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold shrink-0">
            {getIniciais(data.nome)}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-800 text-lg truncate" title={data.nome}>
              {data.nome}
            </h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600">
              Docente
            </span>
          </div>
        </div>

        {/* Detalhes: Email e CPF */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail size={16} className="text-gray-400" />
            <span className="truncate" title={data.email}>{data.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CreditCard size={16} className="text-gray-400" />
            <span className="font-mono">{data.cpf}</span>
          </div>
        </div>

        {/* Rodapé: Ações */}
        <div className="flex gap-2 pt-4 border-t border-gray-50">
          <button 
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-logoenf hover:text-white transition-colors text-sm font-medium"
            onClick={() => alert(`Editar ${data.nome} (Em breve)`)}
          >
            <Pencil size={16} /> Editar
          </button>
          
          <button 
            className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Excluir Professor"
            onClick={() => alert(`Excluir ${data.nome} (Em breve)`)}
          >
            <Trash2 size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}