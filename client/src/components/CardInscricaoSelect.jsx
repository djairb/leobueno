export default function CardInscricaoSelect({ inscricao, selecionada, onSelect }) {
  const statusMap = {
    a_comecar: { label: "A começar", className: "bg-yellow-200 text-yellow-900" },
    em_andamento: { label: "Em andamento", className: "bg-blue-200 text-blue-900" },
    finalizado: { label: "Finalizado", className: "bg-green-200 text-green-900" },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <div
      onClick={() => onSelect(inscricao)}
      className={`cursor-pointer flex flex-col bg-white rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-[1.01] transition transform border-2 ${
        selecionada ? "border-blue-600" : "border-transparent"
      }`}
    >
      <h3 className="text-lg font-bold text-gray-800">{inscricao.descricao}</h3>

      <span
        className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          statusMap[inscricao.status]?.className || "bg-gray-200 text-gray-700"
        }`}
      >
        {statusMap[inscricao.status]?.label || inscricao.status}
      </span>

      <p className="text-sm text-gray-600 mt-3">
        Projeto:{" "}
        <span className="font-semibold">
          {inscricao.nome_projeto || `ID ${inscricao.id_projeto}`}
        </span>
      </p>

      <p className="text-sm text-gray-600 mt-1">
        Período: {formatDate(inscricao.data_inicio)} → {formatDate(inscricao.data_final)}
      </p>
    </div>
  );
}
