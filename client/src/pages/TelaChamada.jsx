import React, { useState } from 'react';

const DADOS_MOCK = {
  aula: {
    id: 1,
    curso: 'Técnico em Enfermagem',
    turma: 'ENF-2025.1 (Matutino)',
    disciplina: 'Anatomia Humana I',
    data: '18/11/2025',
    professor: 'Enf. Dr. João Silva'
  },
  alunos: [
    { id: 1, nome: 'Ana Clara Souza', matricula: '2025001', foto: '👩🏻' },
    { id: 2, nome: 'Bruno Mendes', matricula: '2025002', foto: '👨🏽' },
    { id: 3, nome: 'Carlos Eduardo', matricula: '2025003', foto: '👱🏻‍♂️' },
    { id: 4, nome: 'Daniela Oliveira', matricula: '2025004', foto: '👩🏾' },
    { id: 5, nome: 'Eduardo Santos', matricula: '2025005', foto: '👨🏿' },
  ]
};

export default function TelaChamada() {
  const [frequencias, setFrequencias] = useState(
    DADOS_MOCK.alunos.reduce((acc, aluno) => {
      acc[aluno.id] = 'Presente'; 
      return acc;
    }, {})
  );

  const handleStatusChange = (alunoId, novoStatus) => {
    setFrequencias(prev => ({ ...prev, [alunoId]: novoStatus }));
  };

  const salvarChamada = () => {
    alert("Frequência salva com sucesso!");
  };

  const getButtonClass = (statusAtual, statusBotao) => {
    const base = "px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ";
    if (statusAtual === statusBotao) {
      if (statusBotao === 'Presente') return base + "bg-teal-600 text-white shadow-lg"; // Mudei para Teal (Verde escuro)
      if (statusBotao === 'Ausente') return base + "bg-rose-600 text-white shadow-lg"; // Mudei para Rose (Vermelho suave)
      if (statusBotao === 'Justificado') return base + "bg-amber-500 text-white shadow-lg";
    }
    return base + "bg-gray-100 text-gray-500 hover:bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden mb-6">
        
        {/* --- NOVO HEADER --- */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-600 p-6 text-white shadow-inner relative">
          
          {/* Elemento decorativo de fundo (círculo translúcido) */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center gap-6 relative z-10">
            
            {/* Imagem / Logo */}
            <div className="flex-shrink-0 bg-white/20 p-1 rounded-lg backdrop-blur-sm">
               {/* Substitua o src pela URL da sua logo ou arquivo local */}
               <img 
                 src="https://placehold.co/100x100/teal/white?text=Enf" 
                 alt="Logo Escola" 
                 className="w-20 h-20 rounded-md object-cover shadow-md"
               />
            </div>

            {/* Textos do Header */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-teal-100 text-xs font-bold tracking-widest uppercase mb-1">
                    {DADOS_MOCK.aula.curso} • {DADOS_MOCK.aula.turma}
                  </p>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {DADOS_MOCK.aula.disciplina}
                  </h1>
                </div>
                
                {/* Badge da Data */}
                <div className="hidden sm:flex flex-col items-center bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm border border-white/10">
                  <span className="text-xs text-teal-100 uppercase">Data</span>
                  <span className="font-bold text-lg">{DADOS_MOCK.aula.data.split('/')[0]}/{DADOS_MOCK.aula.data.split('/')[1]}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-teal-50 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="font-medium opacity-90">Prof. {DADOS_MOCK.aula.professor}</span>
              </div>
            </div>

          </div>
        </div>
        {/* --- FIM DO HEADER --- */}

        {/* Lista de Alunos (Mantida igual, apenas ajustando cores de hover) */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-1 gap-3">
            {DADOS_MOCK.alunos.map((aluno) => (
              <div key={aluno.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-teal-50/50 transition-colors rounded-lg">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-200">
                    {aluno.foto}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg leading-tight">{aluno.nome}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">MAT: {aluno.matricula}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['Presente', 'Ausente', 'Justificado'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(aluno.id, status)}
                      className={getButtonClass(frequencias[aluno.id], status)}
                    >
                      {status === 'Justificado' ? 'Justif.' : status}
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Presença: <span className="font-bold text-teal-700 text-lg">{Object.values(frequencias).filter(s => s === 'Presente').length}/{DADOS_MOCK.alunos.length}</span>
          </div>
          
          <button 
            onClick={salvarChamada}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-teal-200 transform active:scale-95 transition-all flex items-center gap-2"
          >
            <span>Salvar Diário</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}