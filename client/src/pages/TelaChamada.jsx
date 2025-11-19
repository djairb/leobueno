import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Calendar, BookOpen, Users, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../infra/apiConfig';

export default function TelaChamada() {
  // Dados de Seleção
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]); // Vamos precisar carregar isso tb, ou mockar por enquanto
  
  // Estado do Formulário de Chamada
  const [selecao, setSelecao] = useState({ turma_id: '', disciplina_id: '', data: new Date().toISOString().split('T')[0] });
  const [alunos, setAlunos] = useState([]);
  const [frequencias, setFrequencias] = useState({});
  const [conteudo, setConteudo] = useState("");
  const [statusEnvio, setStatusEnvio] = useState({ type: '', message: '' });

  // 1. Carregar Listas Iniciais
  useEffect(() => {
    axios.get(`${API_BASE_URL}/turmas`).then(res => setTurmas(res.data));
    // Mockando disciplinas por enquanto pq não fizemos a rota GET /disciplinas ainda
    // Se quiser, podemos criar a rota, mas pra demo isso basta:
    setDisciplinas([
      { id: 1, nome: 'Anatomia Humana' },
      { id: 2, nome: 'Fisiologia' },
      { id: 3, nome: 'Ética Profissional' }
    ]);
  }, []);

  // 2. Quando selecionar a turma, carregar os alunos DELA
  useEffect(() => {
    if (selecao.turma_id) {
      axios.get(`${API_BASE_URL}/turmas/${selecao.turma_id}/alunos`)
        .then(res => {
          setAlunos(res.data);
          // Inicia todo mundo com 'Presente'
          const inicial = {};
          res.data.forEach(a => inicial[a.matricula_id] = 'Presente');
          setFrequencias(inicial);
        })
        .catch(err => console.error(err));
    } else {
      setAlunos([]);
    }
  }, [selecao.turma_id]);

  const toggleStatus = (matriculaId, novoStatus) => {
    setFrequencias(prev => ({ ...prev, [matriculaId]: novoStatus }));
  };

  const salvarChamada = async () => {
    if (!selecao.turma_id || !selecao.disciplina_id) {
      alert("Selecione a Turma e a Disciplina!");
      return;
    }

    setStatusEnvio({ type: 'loading', message: 'Salvando diário...' });

    const payload = {
      turma_id: selecao.turma_id,
      disciplina_id: selecao.disciplina_id,
      data_aula: selecao.data,
      conteudos: conteudo,
      professor_id: 1, // Hardcoded pra demo
      frequencias: Object.entries(frequencias).map(([matId, status]) => ({
        matricula_id: matId,
        status: status
      }))
    };

    try {
      await axios.post(`${API_BASE_URL}/chamada`, payload);
      setStatusEnvio({ type: 'success', message: 'Chamada salva com sucesso!' });
      setTimeout(() => setStatusEnvio({ type: '', message: '' }), 3000);
      setConteudo(""); // Limpa conteúdo
    } catch (error) {
      console.error(error);
      setStatusEnvio({ type: 'error', message: 'Erro ao salvar.' });
    }
  };

  const getButtonClass = (statusAtual, statusBotao) => {
    const base = "px-3 py-1 rounded text-xs font-bold transition-all uppercase ";
    if (statusAtual === statusBotao) {
      if (statusBotao === 'Presente') return base + "bg-teal-600 text-white shadow-md ring-2 ring-teal-200";
      if (statusBotao === 'Ausente') return base + "bg-rose-600 text-white shadow-md ring-2 ring-rose-200";
      if (statusBotao === 'Justificado') return base + "bg-amber-500 text-white shadow-md ring-2 ring-amber-200";
    }
    return base + "bg-gray-100 text-gray-400 hover:bg-gray-200";
  };

  return (
    <div className="min-h-full font-sans pb-10">
      
      {/* Cabeçalho de Configuração da Aula */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-logoenf"/> Configurar Aula
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Turma</label>
                <select 
                    className="w-full p-2 border rounded mt-1"
                    value={selecao.turma_id}
                    onChange={e => setSelecao({...selecao, turma_id: e.target.value})}
                >
                    <option value="">Selecione...</option>
                    {turmas.map(t => <option key={t.id} value={t.id}>{t.codigo} - {t.turno}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Disciplina</label>
                <select 
                    className="w-full p-2 border rounded mt-1"
                    value={selecao.disciplina_id}
                    onChange={e => setSelecao({...selecao, disciplina_id: e.target.value})}
                >
                    <option value="">Selecione...</option>
                    {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Data</label>
                <input 
                    type="date" 
                    className="w-full p-2 border rounded mt-1"
                    value={selecao.data}
                    onChange={e => setSelecao({...selecao, data: e.target.value})}
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Conteúdo</label>
                <input 
                    type="text" 
                    className="w-full p-2 border rounded mt-1"
                    placeholder="Ex: Introdução à Anatomia..."
                    value={conteudo}
                    onChange={e => setConteudo(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Lista de Chamada */}
      {selecao.turma_id ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700 font-bold">
                    <Users size={20} />
                    Lista de Presença ({alunos.length})
                </div>
                <div className="text-sm text-gray-500">
                    Presentes: <span className="text-teal-600 font-bold">{Object.values(frequencias).filter(s => s === 'Presente').length}</span>
                </div>
            </div>

            {alunos.length === 0 ? (
                <div className="p-8 text-center text-gray-400">Nenhum aluno matriculado nesta turma.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {alunos.map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between p-4 hover:bg-blue-50/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-logoenf to-logoenf-dark text-white flex items-center justify-center font-bold text-sm">
                                {aluno.nome.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{aluno.nome}</p>
                                <p className="text-xs text-gray-400 font-mono">CPF: {aluno.cpf}</p>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            {['Presente', 'Ausente', 'Justificado'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => toggleStatus(aluno.matricula_id, status)}
                                    className={getButtonClass(frequencias[aluno.matricula_id], status)}
                                >
                                    {status === 'Justificado' ? 'Just.' : status}
                                </button>
                            ))}
                        </div>
                    </div>
                    ))}
                </div>
            )}

            {/* Rodapé com Salvar */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                    onClick={salvarChamada}
                    disabled={statusEnvio.type === 'loading' || alunos.length === 0}
                    className="bg-logoenf hover:bg-logoenf-dark text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {statusEnvio.type === 'loading' ? 'Salvando...' : (
                        <>
                           <Save size={18} /> Finalizar Diário
                        </>
                    )}
                </button>
            </div>
          </div>
      ) : (
          <div className="text-center py-20 opacity-50">
              <Calendar size={64} className="mx-auto mb-4 text-gray-300"/>
              <p className="text-xl font-medium text-gray-500">Selecione uma turma acima para começar.</p>
          </div>
      )}
      
      {/* Toast de Sucesso */}
      {statusEnvio.message && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-2xl text-white font-bold flex items-center gap-3 animate-bounce ${
              statusEnvio.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
              <CheckCircle /> {statusEnvio.message}
          </div>
      )}

    </div>
  );
}