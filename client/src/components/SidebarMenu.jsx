import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookCheck,
  GraduationCap,
  Users,
  UserRound,
  History, // Ícone para Histórico
  PieChart // Ícone para Relatórios
} from "lucide-react";

export default function SidebarMenu({ open, setOpen }) {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm";
  const activeClasses = "bg-logoenf text-white shadow-md shadow-logoenf/20";
  const inactiveClasses = "text-gray-600 hover:bg-logoenf-light/10 hover:text-logoenf-dark";

  const groups = [
    {
      title: "Principal",
      iconColor: "text-blue-500",
      links: [
        { to: "/", label: "Visão Geral", icon: <LayoutDashboard size={20} /> },
      ],
    },
    {
      title: "Secretaria", 
      iconColor: "text-purple-500",
      links: [
        { to: "/professores", label: "Professores", icon: <UserRound size={20} /> },
        { to: "/alunos", label: "Alunos", icon: <Users size={20} /> },
        { to: "/turmas", label: "Turmas", icon: <GraduationCap size={20} /> },
      ],
    },
    {
      title: "Acadêmico",
      iconColor: "text-logoenf", 
      links: [
        { to: "/chamada", label: "Realizar Chamada", icon: <BookCheck size={20} /> },
        // Link Novo: Histórico Geral de Aulas
        { to: "/aulas", label: "Histórico de Aulas", icon: <History size={20} /> },
      ],
    },
    {
      title: "Gestão",
      iconColor: "text-orange-500",
      links: [
        // Link dos Gráficos que criamos
        { to: "/relatorios", label: "Relatórios & Gráficos", icon: <PieChart size={20} /> },
      ],
    },
  ];

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end // Garante que a rota exata seja ativada
                      className={({ isActive }) =>
                        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={isActive ? "text-white" : group.iconColor}>
                            {link.icon}
                          </span>
                          {link.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        
        {/* Rodapé */}
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          v1.0.0 • Sistema Escolar
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
        <aside className={`absolute top-0 left-0 w-72 h-full bg-white shadow-2xl transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-logoenf text-white">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded">✕</button>
          </div>
          <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">{group.title}</h3>
                <ul className="space-y-1">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        end
                        onClick={() => setOpen(false)}
                        className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                      >
                         {({ isActive }) => (
                            <>
                              <span className={isActive ? "text-white" : group.iconColor}>{link.icon}</span>
                              {link.label}
                            </>
                          )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}