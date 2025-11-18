// src/components/PessoaCard.jsx

export default function PessoaCard({ pessoa, selecionada, onSelect, calcularIdade }) {

  return (
    <div
      onClick={() => onSelect(pessoa)}
      // Mantivemos o padding reduzido da última vez (py-2)
      className={`px-4 py-2 border rounded-lg shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-center ${
        selecionada
          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
          : "bg-white hover:shadow-md hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="w-11/12">
          {/* ALTERAÇÃO 1: Tamanho da fonte do nome reduzido de text-lg para text-base */}
          <h3 className="text-base font-semibold text-gray-800 break-words">
            {pessoa.nome_completo}
          </h3>
        </div>
        {selecionada && (
          <div className="w-1/12 flex justify-end">
             {/* ALTERAÇÃO 2: Ícone ligeiramente menor (h-5 w-5) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* ALTERAÇÃO 3: Removida a margem superior (mt-1) */}
      <p className="text-sm text-gray-500">Apelido: {pessoa.apelido}</p>
      <p className="text-sm text-gray-500">
        Idade: {calcularIdade(pessoa.data_nasc)} anos
      </p>
    </div>
  );
}