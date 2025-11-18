// src/components/PessoaSelecionadaCard.jsx

export default function PessoaSelecionadaCard({ pessoa, onDelete, calcularIdade }) {
  return (
    <div className="p-3 bg-gray-50 border rounded-lg flex items-center justify-between shadow-sm">
      {/* Informações da Pessoa */}
      <div>
        <h4 className="text-base font-semibold text-gray-800">
          {pessoa.nome_completo}
        </h4>
        <p className="text-sm text-gray-500">
          {pessoa.apelido}, {calcularIdade(pessoa.data_nasc)} anos
        </p>
      </div>

      {/* Botão de Excluir */}
      <button
        onClick={() => onDelete(pessoa)}
        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
        aria-label="Remover pessoa"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}