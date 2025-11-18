import { useNavigate } from "react-router-dom";
import { Pencil, Trash, X } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../infra/apiConfig";

export default function CardInscricao({
  id_inscricao,
  descricao,
  status,
  data_inicio,
  data_final,
  id_projeto,
  nome_projeto,
  onDelete,
}) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔹 Mapa de status → label e cor
  const statusMap = {
    a_comecar: {
      label: "A começar",
      className: "bg-yellow-100 text-yellow-800",
    },
    em_andamento: {
      label: "Em andamento",
      className: "bg-blue-100 text-blue-800",
    },
    finalizado: {
      label: "Finalizado",
      className: "bg-green-100 text-green-800",
    },
  };

  // 🔹 Função para formatar a data no padrão dd/mm/aaaa
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/deletarInscricaoById/${id_inscricao}`);
      setShowConfirm(false);
      if (onDelete) onDelete(id_inscricao);
    } catch (error) {
      console.error("Erro ao excluir inscrição:", error);
      alert("Não foi possível excluir a inscrição.");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-[1.01] transition transform">
        {/* Conteúdo principal */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{descricao}</h3>

          <span
            className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusMap[status]?.className || "bg-gray-100 text-gray-600"
            }`}
          >
            {statusMap[status]?.label || status}
          </span>

          <p className="text-sm text-gray-600 mt-2">
            Projeto:{" "}
            <span className="font-semibold">
              {nome_projeto || `ID ${id_projeto}`}
            </span>
          </p>

          {/* ✅ Datas formatadas */}
          <p className="text-sm text-gray-600 mt-1">
            Período: {formatDate(data_inicio)} &rarr; {formatDate(data_final)}
          </p>
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <button
            onClick={() => navigate(`/editarInscricao/${id_inscricao}`)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
            title="Editar Inscrição"
          >
            <Pencil size={20} />
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition"
            title="Excluir Inscrição"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Confirmar Exclusão</h2>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir a inscrição{" "}
              <span className="font-semibold">{descricao}</span>? Essa ação não poderá ser desfeita.
            </p>

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
