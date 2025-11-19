import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { UserPlus, Save, ArrowLeft, User, GraduationCap, Search, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../infra/apiConfig';

export default function NovaMatricula() {
  // O 'setValue' é crucial aqui para atualizar o valor manualmente quando clicarmos na lista
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // Dados
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);

  // Lógica do Filtro de Alunos
  const [buscaAluno, setBuscaAluno] = useState(""); // O texto que o usuário digita
  const [showLista, setShowLista] = useState(false); // Se a lista está visível ou não
  
  // Monitora qual aluno foi selecionado (para mostrar visualmente)
  const alunoSelecionadoId = watch('aluno_id');
  const alunoSelecionadoObj = alunos.find(a => a.id === alunoSelecionadoId);

  // Carregar dados
  useEffect(() => {
    axios.get(`${API_BASE_URL}/alunos`).then(res => setAlunos(res.data));
    axios.get(`${API_BASE_URL}/turmas`).then(res => setTurmas(res.data));
  }, []);

  // Filtra os alunos baseado no que foi digitado (Nome ou CPF)
  const alunosFiltrados = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) || 
    aluno.cpf.includes(buscaAluno)
  );

  // Função quando clica em um aluno da lista
  const selecionarAluno = (aluno) => {
    setValue('aluno_id', aluno.id); // Avisa o formulário
    setBuscaAluno(aluno.nome); // Preenche o input com o nome
    setShowLista(false); // Esconde a lista
  };

  // Função para limpar a seleção
  const limparSelecao = () => {
    setValue('aluno_id', '');
    setBuscaAluno("");
    setShowLista(true);
  };

  const onSubmit = async (data) => {
    setStatus({ type: 'loading', message: 'Matriculando...' });
    try {
      await axios.post(`${API_BASE_URL}/matriculas`, data);
      setStatus({ type: 'success', message: 'Matrícula realizada com sucesso!' });
      
      // Reset total
      reset(); 
      setBuscaAluno(""); 
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Erro ao matricular.' });
    }
  };

  return (
    <div className="p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-lg">
        <Link to="/turmas" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors w-fit">
          <ArrowLeft size={20} className="mr-2" /> Voltar
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[500px]">
          
          <div className="bg-indigo-600 p-8 text-white flex items-center gap-5">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <UserPlus size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Matricular Aluno</h1>
              <p className="text-indigo-100 opacity-90">Vincule um aluno a uma turma ativa.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {status.message && (
              <div className={`p-4 rounded-lg text-sm font-medium ${
                status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            {/* 1. SELEÇÃO DE TURMA (Mantive Select normal, pois são poucas) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Selecione a Turma *</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <select 
                  {...register("turma_id", { required: "A turma é obrigatória" })}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 appearance-none cursor-pointer"
                >
                  <option value="">Escolha a turma...</option>
                  {turmas.map(turma => (
                    <option key={turma.id} value={turma.id}>
                       {turma.codigo} - {turma.nome_curso} ({turma.turno})
                    </option>
                  ))}
                </select>
              </div>
              {errors.turma_id && <span className="text-xs text-red-500 mt-1">Campo obrigatório</span>}
            </div>

            {/* 2. SELEÇÃO DE ALUNO (COM BUSCA INTELIGENTE) */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">Buscar Aluno *</label>
              
              {/* Input "escondido" que guarda o ID real pro formulário enviar */}
              <input type="hidden" {...register("aluno_id", { required: "Selecione um aluno" })} />

              <div className="relative">
                <div className="absolute left-3 top-3.5 text-gray-400">
                  {alunoSelecionadoId ? <User size={20} className="text-indigo-600" /> : <Search size={20} />}
                </div>
                
                <input 
                  type="text" 
                  className={`w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                    alunoSelecionadoId ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold' : 'bg-gray-50'
                  }`}
                  placeholder="Digite o nome ou CPF..."
                  value={buscaAluno}
                  onChange={(e) => {
                    setBuscaAluno(e.target.value);
                    setShowLista(true);
                    if(alunoSelecionadoId) setValue('aluno_id', ''); // Limpa ID se o usuário apagar o nome
                  }}
                  onFocus={() => setShowLista(true)}
                />

                {/* Botãozinho X para limpar seleção */}
                {buscaAluno && (
                  <button 
                    type="button"
                    onClick={limparSelecao}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Lista Flutuante de Resultados */}
              {showLista && buscaAluno && !alunoSelecionadoId && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {alunosFiltrados.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center text-sm">Nenhum aluno encontrado.</div>
                  ) : (
                    alunosFiltrados.map(aluno => (
                      <div 
                        key={aluno.id} 
                        onClick={() => selecionarAluno(aluno)}
                        className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group"
                      >
                        <div>
                          <p className="font-medium text-gray-800 group-hover:text-indigo-700">{aluno.nome}</p>
                          <p className="text-xs text-gray-500">CPF: {aluno.cpf}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 text-indigo-600">
                          <Check size={16} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {errors.aluno_id && <span className="text-xs text-red-500 mt-1">Selecione um aluno da lista</span>}
            </div>

            <button 
              type="submit" 
              disabled={status.type === 'loading'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 mt-8"
            >
              {status.type === 'loading' ? 'Processando...' : <><Save size={22} /> Confirmar Matrícula</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}