export default function CardCandidato({
  nome,
  apelido,
  idade,
  inscricaoDescricao,
  projetoNome,
  status // 👈 receber status do candidato
}) {
  const statusColors = {
    aprovado: "bg-green-100 text-green-800",
    reprovado: "bg-red-100 text-red-800",
    pendente: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="flex items-start bg-white rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-[1.01] transition transform">
      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">{nome}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {status === "aprovado"
              ? "Aprovado"
              : status === "reprovado"
              ? "Reprovado"
              : "Pendente"}
          </span>
        </div>

        {apelido && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Apelido:</span> {apelido}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Idade:</span> {idade} anos
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Projeto:</span> {projetoNome}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Inscrição:</span> {inscricaoDescricao}
        </p>
      </div>
    </div>
  );
}
