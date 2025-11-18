import { useNavigate } from "react-router-dom";
import { Pencil, Trash, X } from "lucide-react"; // Ícones
import axios from "axios";
import { useState } from "react";

import { API_IMAGEM_URL, API_BASE_URL } from '../infra/apiConfig';

export default function CardProjeto({ id_projeto, nome, descricao, status, logo_projeto, onDelete }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const statusColors = {
    a_comecar: "bg-yellow-100 text-yellow-800",
    em_andamento: "bg-blue-100 text-blue-800",
    finalizado: "bg-green-100 text-green-800",
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/deleteProjetoById/${id_projeto}`,
        { params: { logo_projeto } }
      );
      setShowConfirm(false);
      if (onDelete) onDelete(id_projeto); // pra atualizar lista sem reload
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      alert("Não foi possível excluir o projeto.");
    }
  };

  return (
    <>
      <div className="flex items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-[1.01] transition transform">
        {/* Logo */}
        {logo_projeto && (
          <img
            src={`${API_IMAGEM_URL}${logo_projeto}`}
            alt={nome}
            className="w-24 h-24 object-cover rounded-lg border mr-4"
          />
        )}

        {/* Conteúdo principal */}
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-800">{nome}</h3>

          <span
            className={`mt-1 w-fit px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {status === "a_comecar"
              ? "A começar"
              : status === "em_andamento"
              ? "Em andamento"
              : "Finalizado"}
          </span>

          <p className="text-sm text-gray-600 mt-2">{descricao}</p>
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-2">
          {/* Botão de editar */}
          <button
            onClick={() => navigate(`/editarProjeto/${id_projeto}`)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
            title="Editar Projeto"
          >
            <Pencil size={20} />
          </button>

          {/* Botão de excluir */}
          <button
            onClick={() => setShowConfirm(true)}
            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition"
            title="Excluir Projeto"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Confirmar Exclusão</h2>
              <button onClick={() => setShowConfirm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o projeto <span className="font-semibold">{nome}</span>?
              Essa ação não poderá ser desfeita.
            </p>

            {/* Botões */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
