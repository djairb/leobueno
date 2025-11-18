// src/components/Header.jsx

// 1. Tirei as chaves { } 
// 2. Adicionei a extensão (Verifique se é .png, .svg ou .jpg na sua pasta)
import logo from '../img/health-icon-1.svg'; 

export default function Header({ onMenuClick }) {
  return (
    <header className="flex items-center justify-center bg-white px-4 py-4 shadow-md border-b-2 border-solid border-logoenf">
      
      <button 
        className="md:hidden text-2xl text-gray-700 hover:text-logoenf transition-colors px-4 "
        onClick={onMenuClick}
      >
        ☰
      </button>

      <div className="flex items-center gap-3 md:ml-32">
        
        <img 
          src={logo} 
          alt="Logo da Escola" 
          className="h-10 w-10 object-contain rounded" 
        />

        <h1 className="text-lg text-logoenf font-bold">
          Sistema de Registro de Aulas
        </h1>
      </div>

      <div className="w-8 md:hidden"></div>

    </header>
  );
}