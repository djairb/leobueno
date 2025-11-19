// src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SidebarMenu from './components/SidebarMenu';
import Header from './components/Header';

// Imports das Páginas
import Home from './pages/Home';
import TelaChamada from './pages/TelaChamada'; // <--- Já estava importado aqui
import CadastroProfessor from './pages/CadastroProfessor';
import ListaProfessores from './pages/ListarProfessores';
import ListaAlunos from './pages/ListaAlunos';
import CadastroAluno from './pages/CadastroAluno';
import ListaTurmas from './pages/ListaTurmas';
import CadastroTurma from './pages/CadastroTurma';
import NovaMatricula from './pages/NovaMatricula';
import RelatorioTurma from './pages/RelatorioTurma';
import RelatorioAluno from './pages/RelatorioAluno';
import ListaAulas from './pages/ListaAulas';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header onMenuClick={() => setMenuOpen(true)} />

        <div className="flex flex-1">
          <SidebarMenu open={menuOpen} setOpen={setMenuOpen} />

          <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
            <Routes>

              {/* Dashboard */}
              <Route path="/" element={<Home />} />

              {/* Professores */}
              <Route path="/professores/novo" element={<CadastroProfessor />} />
              <Route path="/professores" element={<ListaProfessores />} />

              {/* Alunos */}
              <Route path="/alunos" element={<ListaAlunos />} />
              <Route path="/alunos/novo" element={<CadastroAluno />} />

              {/* Turmas e Matrículas */}
              <Route path="/turmas" element={<ListaTurmas />} />
              <Route path="/turmas/nova" element={<CadastroTurma />} />
              <Route path="/matriculas/nova" element={<NovaMatricula />} />

              {/* --- AQUI ESTÁ A ROTA DA CHAMADA --- */}
              <Route path="/chamada" element={<TelaChamada />} />

              <Route path="/relatorios" element={<RelatorioTurma />} />
              <Route path="/relatorios/aluno/:id/turma/:turmaId" element={<RelatorioAluno />} />
              <Route path="/aulas" element={<ListaAulas />} />

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}