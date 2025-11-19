import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form'; // <--- A estrela do show
import { UserRoundPlus, Mail, CreditCard, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../infra/apiConfig';

export default function CadastroProfessor() {
  // Configuração do Hook Form
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  
  // Estado apenas para feedback visual
  const [status, setStatus] = useState({ type: '', message: '' });

  // Máscara de CPF
  const mascaraCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Manipulador para atualizar o CPF com máscara no Hook Form
  const handleCPFChange = (e) => {
    const masked = mascaraCPF(e.target.value);
    setValue('cpf', masked); // Atualiza o valor interno
  };

  // Função de Envio
  const onSubmit = async (data) => {
    setStatus({ type: 'loading', message: 'Salvando dados...' });

    try {
      await axios.post(`${API_BASE_URL}/professores`, data);
      
      setStatus({ type: 'success', message: 'Professor cadastrado com sucesso!' });
      reset(); // Limpa o formulário
      
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);

    } catch (error) {
      const msgErro = error.response?.data?.error || "Erro ao conectar com o servidor.";
      setStatus({ type: 'error', message: msgErro });
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full flex flex-col items-center">
      
      <div className="w-full max-w-2xl">
        <Link to="/professores" className="flex items-center text-gray-500 hover:text-logoenf mb-6 transition-colors w-fit">
          <ArrowLeft size={20} className="mr-2" /> Voltar para Lista
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-gradient-to-r from-logoenf to-logoenf-dark p-8 text-white flex items-center gap-5">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <UserRoundPlus size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Novo Professor</h1>
              <p className="text-logoenf-light opacity-90 mt-1">Cadastre os docentes para vincular às turmas.</p>
            </div>
          </div>

          {/* Hook Form controla o submit agora */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            
            {status.message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
                status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                {status.message}
              </div>
            )}

            {/* Input Nome */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo *</label>
              <div className="relative">
                <UserRoundPlus className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  {...register("nome", { required: "Nome é obrigatório" })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-logoenf outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.nome ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Ex: Dr. Roberto Martins"
                />
              </div>
              {errors.nome && <span className="text-xs text-red-500 mt-1 ml-1">{errors.nome.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Institucional *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    {...register("email", { required: "E-mail é obrigatório" })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-logoenf outline-none transition-all bg-gray-50/50 focus:bg-white ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="prof@escola.com"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</span>}
              </div>

              {/* Input CPF */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CPF *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    {...register("cpf", { required: "CPF é obrigatório", minLength: { value: 14, message: "CPF incompleto" } })}
                    onChange={handleCPFChange}
                    maxLength={14}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-logoenf outline-none transition-all bg-gray-50/50 focus:bg-white font-mono ${errors.cpf ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="000.000.000-00" 
                  />
                </div>
                {errors.cpf && <span className="text-xs text-red-500 mt-1 ml-1">{errors.cpf.message}</span>}
              </div>
            </div>

            {/* Botão Submit */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={status.type === 'loading'}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-logoenf/20 flex justify-center items-center gap-2 transition-all ${
                  status.type === 'loading' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-logoenf hover:bg-logoenf-dark text-white transform hover:-translate-y-1'
                }`}
              >
                {status.type === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Salvando...
                  </span>
                ) : (
                  <>
                    <Save size={22} /> Cadastrar Professor
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}