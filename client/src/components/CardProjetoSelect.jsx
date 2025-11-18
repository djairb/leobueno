// src/components/CardProjetoSelect.jsx
import { API_IMAGEM_URL } from "../infra/apiConfig";

export default function CardProjetoSelect({ projeto, selecionado, onSelect }) {
  const statusColors = {
    a_comecar: "bg-yellow-100 text-yellow-800",
    em_andamento: "bg-blue-100 text-blue-800",
    finalizado: "bg-green-100 text-green-800",
  };

  return (
    <div
      onClick={() => onSelect(projeto)}
      className={`flex items-center bg-white rounded-xl shadow-md p-4 cursor-pointer transition transform hover:shadow-lg hover:scale-[1.01] ${
        selecionado ? "border-2 border-blue-600" : "border border-gray-200"
      }`}
    >
      {/* Logo */}
      {projeto.logo_projeto && (
        <img
          src={`${API_IMAGEM_URL}${projeto.logo_projeto}`}
          alt={projeto.nome}
          className="w-20 h-20 object-cover rounded-lg border mr-4"
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800">{projeto.nome}</h3>

        <span
          className={`mt-1 w-fit px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[projeto.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {projeto.status === "a_comecar"
            ? "A começar"
            : projeto.status === "em_andamento"
            ? "Em andamento"
            : "Finalizado"}
        </span>

        {projeto.descricao && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {projeto.descricao}
          </p>
        )}
      </div>
    </div>
  );
}
