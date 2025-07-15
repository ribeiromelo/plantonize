import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react'; // Importando ícones para as mensagens de feedback

const CriarEvolucao = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [atribuidoA, setAtribuidoA] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const buscarColaboradores = async () => {
      try {
        const response = await api.get('usuarios/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const apenasColaboradores = response.data.filter(user => user.tipo_usuario === 'colaborador');
        setColaboradores(apenasColaboradores);
        // Opcional: Definir o primeiro colaborador como padrão se houver
        if (apenasColaboradores.length > 0) {
          setAtribuidoA(apenasColaboradores[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar colaboradores:", err);
        setErro('Erro ao carregar colaboradores para atribuição.');
      }
    };

    if (token) {
      buscarColaboradores();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(''); // Limpa mensagens anteriores
    setErro(''); // Limpa erros anteriores

    try {
      await api.post('evolucoes/', {
        titulo,
        categoria,
        conteudo,
        atribuido_a: atribuidoA || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensagem('Evolução criada com sucesso!');
      // Limpa os campos após o sucesso
      setTitulo('');
      setCategoria('');
      setConteudo('');
      setAtribuidoA(colaboradores.length > 0 ? colaboradores[0].id : ''); // Reseta para o primeiro ou vazio
      
      setTimeout(() => navigate('/dashboard'), 1500); // Redireciona após um pequeno delay
    } catch (err) {
      console.error("Erro ao salvar evolução:", err);
      setErro('Erro ao salvar evolução. Verifique os campos e tente novamente.');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto py-8">
        {/* Botão de Voltar */}
        <button
          onClick={() => navigate(-1)} // Volta para a página anterior
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Voltar para o Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">Criar Nova Evolução</h1>

          {mensagem && (
            <div className="flex items-center p-4 mb-6 text-green-700 bg-green-100 rounded-lg shadow-sm" role="alert">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <div>
                <span className="font-medium">{mensagem}</span>
              </div>
            </div>
          )}
          {erro && (
            <div className="flex items-center p-4 mb-6 text-red-700 bg-red-100 rounded-lg shadow-sm" role="alert">
              <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <div>
                <span className="font-medium">{erro}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6"> {/* Espaçamento entre os campos */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">Título da Evolução:</label>
              <input
                type="text"
                id="titulo"
                placeholder="Ex: Evolução Clínica do Paciente X"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm placeholder-gray-400 text-gray-800"
                required
              />
            </div>

            <div>
              <label htmlFor="categoria" className="block text-sm font-semibold text-gray-700 mb-2">Categoria:</label>
              <input
                type="text"
                id="categoria"
                placeholder="Ex: UPA, Posto de Saúde, Hospital"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm placeholder-gray-400 text-gray-800"
                required
              />
            </div>

            <div>
              <label htmlFor="conteudo" className="block text-sm font-semibold text-gray-700 mb-2">Conteúdo da Evolução:</label>
              <textarea
                id="conteudo"
                placeholder="Descreva detalhadamente a evolução do paciente..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm placeholder-gray-400 text-gray-800 resize-y" // Min-height ajustado e resize vertical
                required
              />
            </div>

            <div>
              <label htmlFor="atribuir" className="block text-sm font-semibold text-gray-700 mb-2">Atribuir a:</label>
              <select
                id="atribuir"
                value={atribuidoA}
                onChange={(e) => setAtribuidoA(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 shadow-sm text-gray-800 appearance-none" // appearance-none para customizar setinha, bg-white para fundo
              >
                <option value="">-- Nenhum --</option>
                {colaboradores.map(colab => (
                  <option key={colab.id} value={colab.id}>
                    {colab.username}
                  </option>
                ))}
              </select>
              {/* Adicionar uma "setinha" customizada para o select, já que appearance-none remove a padrão */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg
                         transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 font-bold text-lg"
            >
              Salvar Evolução
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriarEvolucao;