import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { GraduationCap, Save, ArrowLeft, Calendar, Clock, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../infra/apiConfig';

export default function CadastroTurma() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [cursos, setCursos] = useState([]); // Estado para guardar a lista de cursos
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. Buscar os cursos assim que a tela abre
  useEffect(() => {
    axios.get(`${API_BASE_URL}/cursos`)
      .then(res => setCursos(res.data))
      .catch(err => console.error("Erro ao carregar cursos", err));
  }, []);

  const onSubmit = async (data) => {
    setStatus({ type: 'loading', message: 'Criando turma...' });
    try {
      await axios.post(`${API_BASE_URL}/turmas`, data);
      setStatus({ type: 'success', message: 'Turma criada com sucesso!' });
      reset();
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro ao salvar turma.' });
    }
  };

  return (
    <div className="p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <Link to="/turmas" className="flex items-center text-gray-500 hover:text-amber-600 mb-6 transition-colors w-fit">
          <ArrowLeft size={20} className="mr-2" /> Voltar para Lista
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header Laranja */}
          <div className="bg-amber-600 p-8 text-white flex items-center gap-5">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Abrir Nova Turma</h1>
              <p className="text-amber-100 opacity-90">Defina o curso, período e horários.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {status.message && (
              <div className={`p-4 rounded-lg font-medium text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status.message}
              </div>
            )}

            {/* 1. SELEÇÃO DE CURSO (O Pulo do Gato) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Curso Técnico *</label>
              <div className="relative">
                <select 
                  {...register("curso_id", { required: "Selecione um curso" })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50 appearance-none"
                >
                  <option value="">Selecione...</option>
                  {cursos.map(curso => (
                    <option key={curso.id} value={curso.id}>{curso.nome}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-4 text-gray-400 pointer-events-none">▼</div>
              </div>
              {errors.curso_id && <span className="text-xs text-red-500">Obrigatório</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Código da Turma */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Código da Turma *</label>
                <div className="relative">
                    <Bookmark size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                    <input type="text" {...register("codigo", { required: true })} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50" placeholder="Ex: ENF-2025.1-N" />
                </div>
              </div>

              {/* Período Letivo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Período/Semestre *</label>
                <input type="text" {...register("periodo", { required: true })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50" placeholder="Ex: 2025.1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Turno */}
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Turno</label>
                <div className="relative">
                    <Clock size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                    <select {...register("turno")} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50 appearance-none">
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noite">Noite</option>
                        <option value="Integral">Integral</option>
                    </select>
                </div>
              </div>

              {/* Datas */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Início</label>
                <input type="date" {...register("data_inicio")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fim</label>
                <input type="date" {...register("data_fim")} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-gray-50" />
              </div>
            </div>

            <button type="submit" disabled={status.type === 'loading'} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 mt-4">
               {status.type === 'loading' ? 'Criando...' : <><Save size={22} /> Criar Turma</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}