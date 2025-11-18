import React, { useState } from 'react';
import axios from 'axios';
import { UserRoundPlus, Mail, CreditCard, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CadastroProfessor() {
  // Estado do Formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: ''
  });

  // Estado de Feedback (Carregando, Sucesso, Erro)
  const [status, setStatus] = useState({ type: '', message: '' });

  // Máscara de CPF simples
  const mascaraCPF = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'); // Limita tamanho
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cpf') value = mascaraCPF(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Salvando dados...' });

    try {
      // Ajuste a URL se sua porta for diferente de 3001
      await axios.post('http://localhost:3001/professores', formData);
      
      setStatus({ type: 'success', message: 'Professor cadastrado com sucesso!' });
      setFormData({ nome: '', email: '', cpf: '' }); // Limpa o form

      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);

    } catch (error) {
      const msgErro = error.response?.data?.error || "Erro ao conectar com o servidor.";
      setStatus({ type: 'error', message: msgErro });
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-full flex flex-col items-center">
      
      <div className="w-full max-w-2xl">
        {/* Navegação */}
        <Link to="/" className="flex items-center text-gray-500 hover:text-logoenf mb-6 transition-colors w-fit">
          <ArrowLeft size={20} className="mr-2" /> Voltar ao Painel
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-logoenf to-logoenf-dark p-8 text-white flex items-center gap-5">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <UserRoundPlus size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Novo Professor</h1>
              <p className="text-logoenf-light opacity-90 mt-1">Cadastre os docentes para vincular às turmas.</p>
            </div>
          </div>

          {/* Corpo do Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Mensagens de Feedback */}
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
              <div className="relative">
                <UserRoundPlus className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logoenf focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="Ex: Dr. Roberto Martins"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Institucional</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logoenf focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="prof@escola.com"
                    required 
                  />
                </div>
              </div>

              {/* Input CPF */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength={14}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-logoenf focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white font-mono"
                    placeholder="000.000.000-00"
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
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