import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { UserPlus, Save, ArrowLeft, CreditCard, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../infra/apiConfig';

export default function CadastroAluno() {
  // Extraímos 'errors' do formState para saber qual campo falhou
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  const [status, setStatus] = useState({ type: '', message: '' });

  const mascaraCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (e) => {
    const masked = mascaraCPF(e.target.value);
    setValue('cpf', masked);
  };

  const onSubmit = async (data) => {
    setStatus({ type: 'loading', message: 'Salvando...' });
    
    try {
      await axios.post(`${API_BASE_URL}/alunos`, data); 
      setStatus({ type: 'success', message: 'Aluno cadastrado com sucesso!' });
      reset();
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erro ao salvar.' 
      });
    }
  };

  return (
    <div className="p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-lg">
        <Link to="/alunos" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors w-fit">
          <ArrowLeft size={20} className="mr-2" /> Voltar para Lista
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-6 text-white flex items-center gap-4">
            <UserPlus size={28} />
            <div>
              <h1 className="text-xl font-bold">Novo Aluno</h1>
              <p className="text-blue-100 text-sm">Preencha todos os dados obrigatórios</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
            
            {status.message && (
              <div className={`p-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
                status.type === 'success' ? 'bg-green-100 text-green-700' : 
                status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {status.message}
              </div>
            )}

            {/* Campo NOME */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
              <input 
                type="text" 
                {...register("nome", { required: true })} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 ${errors.nome ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Ex: Ana Souza" 
              />
              {errors.nome && <span className="text-xs text-red-500 mt-1 block">Nome é obrigatório</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Campo CPF */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">CPF *</label>
                <div className="relative">
                    <CreditCard size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                    <input 
                      type="text" 
                      {...register("cpf", { required: true, minLength: 14 })}
                      onChange={handleCPFChange}
                      maxLength={14}
                      className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 font-mono ${errors.cpf ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="000.000.000-00" 
                    />
                </div>
                {errors.cpf && <span className="text-xs text-red-500 mt-1 block">CPF incompleto</span>}
              </div>

              {/* Campo Data Nascimento (AGORA OBRIGATÓRIO) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Data Nasc. *</label>
                <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                    <input 
                      type="date" 
                      {...register("data_nascimento", { required: true })} 
                      className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 ${errors.data_nascimento ? 'border-red-500' : 'border-gray-200'}`}
                    />
                </div>
                {/* Mensagem de erro para a Data */}
                {errors.data_nascimento && <span className="text-xs text-red-500 mt-1 block">Data obrigatória</span>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status.type === 'loading'}
              className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 mt-4 text-white ${
                status.type === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
               {status.type === 'loading' ? 'Salvando...' : <><Save size={20} /> Salvar Aluno</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}