import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const VisualizarEvolucao = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [evolucao, setEvolucao] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [erro, setErro] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carregando, setCarregando] = useState(true); // Novo estado de carregamento

  // Formulário de edição
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true); // Inicia o carregamento
      try {
        const [resEvolucao, resUsuario] = await Promise.all([
          api.get(`evolucoes/${id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get(`usuario/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setEvolucao(resEvolucao.data);
        setUsuarioLogado(resUsuario.data);
        setTitulo(resEvolucao.data.titulo);
        setConteudo(resEvolucao.data.conteudo);
        setCategoria(resEvolucao.data.categoria);
      } catch (err) {
        console.error('Erro ao carregar evolução:', err);
        setErro('Não foi possível carregar a evolução. Verifique sua conexão ou tente novamente.');
      } finally {
        setCarregando(false); // Finaliza o carregamento
      }
    };

    if (token && id) { // Garante que só busca se tiver token e id
      carregarDados();
    }
  }, [id, token]);

  const podeEditar = () => {
  return (
    usuarioLogado?.tipo_usuario === 'admin' ||
    usuarioLogado?.id === evolucao?.criado_por ||
    usuarioLogado?.id === evolucao?.atribuido_a
  );
};


  const handleSalvar = async () => {
    setErro(''); // Limpa erros anteriores
    try {
      await api.patch(`evolucoes/${id}/`, {
        titulo,
        conteudo,
        categoria
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvolucao(prev => ({
        ...prev,
        titulo,
        conteudo,
        categoria
      }));

      setMostrarModal(false);
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
      setErro('Erro ao salvar edição. Verifique os dados e tente novamente.');
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Carregando evolução...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md relative text-center">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline ml-2">{erro}</span>
        </div>
      </div>
    );
  }

  if (!evolucao) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <p className="text-gray-600 text-lg">Evolução não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto py-8">
        {/* Botão de Voltar */}
        <button
          onClick={() => navigate(-1)} // Volta para a página anterior
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Voltar
        </button>

        {/* Card da Evolução */}
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{evolucao.titulo}</h1>

          <div className="text-sm text-gray-600 mb-6 flex flex-wrap gap-x-4 gap-y-2">
            <p><span className="font-semibold">Categoria:</span> {evolucao.categoria}</p>
            <p><span className="font-semibold">Criado em:</span> {new Date(evolucao.data_criacao).toLocaleString()}</p>
            {/* Adicionar mais metadados se existirem, como 'criado_por' */}
            {evolucao.criado_por_nome && (
                <p><span className="font-semibold">Criado por:</span> {evolucao.criado_por_nome}</p>
            )}
          </div>

          <div className="prose max-w-none text-gray-800 leading-relaxed text-lg">
             {/* Usando dangerouslySetInnerHTML para renderizar conteúdo HTML, se for o caso.
                 Se o conteúdo for texto puro, pode remover.
                 CUIDADO: Use isso apenas se tiver certeza de que o 'conteudo' vem de uma fonte confiável para evitar ataques XSS.
                 Caso contrário, use apenas {evolucao.conteudo} */}
            <p className="whitespace-pre-line">{evolucao.conteudo}</p>
          </div>

          {podeEditar() && (
            <div className="mt-8 text-right">
              <button
                onClick={() => setMostrarModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg
                           transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Editar Evolução
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-xl shadow-2xl transform scale-95 animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Evolução</h2>

            <div className="mb-4">
              <label htmlFor="titulo" className="block text-gray-700 text-sm font-semibold mb-2">Título:</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Título da Evolução"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="categoria" className="block text-gray-700 text-sm font-semibold mb-2">Categoria:</label>
              <input
                type="text"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Categoria da Evolução"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="conteudo" className="block text-gray-700 text-sm font-semibold mb-2">Conteúdo:</label>
              <textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
                placeholder="Detalhes da evolução..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarEvolucao;