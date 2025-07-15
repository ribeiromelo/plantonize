import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { History, FileText, Calendar, Search, Filter, PlusCircle, LogOut, UserCircle } from 'lucide-react'; // Adicionado LogOut e UserCircle

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [evolucoes, setEvolucoes] = useState([]);
  const [erro, setErro] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [colaboradores, setColaboradores] = useState([]);
  const [filtroColaborador, setFiltroColaborador] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [evolucaoSelecionada, setEvolucaoSelecionada] = useState(null);

  // Estados de carregamento para aprimorar UX
  const [carregandoEvolucoes, setCarregandoEvolucoes] = useState(true);
  const [carregandoColaboradores, setCarregandoColaboradores] = useState(true);

  const buscarColaboradores = async () => {
    setCarregandoColaboradores(true);
    try {
      const response = await api.get('usuarios/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const soColaboradores = response.data.filter(u => u.tipo_usuario === 'colaborador');
      setColaboradores(soColaboradores);
    } catch (err) {
      console.error('Erro ao buscar colaboradores', err);
    } finally {
      setCarregandoColaboradores(false);
    }
  };

  const fetchEvolucoes = async (colabId = '') => {
    setCarregandoEvolucoes(true);
    setErro(''); // Limpa erro ao iniciar nova busca
    try {
      const url = colabId ? `evolucoes/?colaborador=${colabId}` : 'evolucoes/';
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvolucoes(response.data);
    } catch (err) {
      console.error('Erro ao carregar evoluções.', err);
      setErro('Não foi possível carregar as evoluções. Tente novamente mais tarde.');
    } finally {
      setCarregandoEvolucoes(false);
    }
  };

  const handleFiltroChange = (e) => {
    const selected = e.target.value;
    setFiltroColaborador(selected);
    fetchEvolucoes(selected);
  };

  const buscarUsuario = async () => {
    try {
      const response = await api.get('usuario/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarioLogado(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuário logado.', err);
      // Se der erro ao buscar usuário, pode ser token expirado, então desloga
      logout();
      navigate('/login');
    }
  };

  const confirmarExclusao = async () => {
    if (!evolucaoSelecionada) return;
    setErro(''); // Limpa erro ao tentar excluir
    try {
      await api.delete(`evolucoes/${evolucaoSelecionada}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvolucoes(prev => prev.filter(ev => ev.id !== evolucaoSelecionada));
      setMostrarModalExcluir(false);
      setEvolucaoSelecionada(null);
    } catch (err) {
      console.error('Erro ao excluir evolução:', err);
      setErro('Erro ao excluir evolução. Tente novamente.');
    }
  };

  useEffect(() => {
    if (token) {
      buscarUsuario();
      buscarColaboradores();
      fetchEvolucoes();
    } else {
      navigate('/login'); // Redireciona se não houver token
    }
  }, [token, navigate]); // Adiciona navigate como dependência

  // Filtra as evoluções exibidas com base na busca
  const evolucoesFiltradas = evolucoes.filter((ev) =>
    ev.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    ev.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans antialiased"> {/* antialiased para fontes mais suaves */}
      <div className="max-w-7xl mx-auto py-6 sm:py-8">

        {/* Top Bar / Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">Dashboard</h1>
            {usuarioLogado && (
              <div className="hidden sm:flex items-center gap-2 text-base text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                <UserCircle className="w-5 h-5 text-indigo-500" />
                <span>Olá, <span className="font-semibold">{usuarioLogado.username}</span></span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 inline-block -mt-0.5" /> Sair
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto">
            {usuarioLogado?.tipo_usuario === 'admin' && (
              <>
                <div className="relative w-full sm:w-auto">
                  <label htmlFor="filtro-colaborador" className="sr-only">Filtrar por interno</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="filtro-colaborador"
                    value={filtroColaborador}
                    onChange={handleFiltroChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white text-gray-800 appearance-none"
                  >
                    <option value="">-- Todos os Colaboradores --</option>
                    {carregandoColaboradores ? (
                        <option disabled>Carregando...</option>
                    ) : (
                        colaboradores.map((colab) => (
                            <option key={colab.id} value={colab.id}>
                                {colab.username}
                            </option>
                        ))
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/criar-evolucao')}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 flex items-center justify-center w-full sm:w-auto"
                >
                  <PlusCircle className="w-5 h-5 mr-2" /> Criar Evolução
                </button>
              </>
            )}

            {usuarioLogado && (
              <div className="sm:hidden flex items-center gap-4 text-sm text-gray-700 w-full justify-end">
                <span>Olá, <span className="font-semibold">{usuarioLogado.username}</span></span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 inline-block -mt-0.5" /> Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Search Bar Section */}
        <div className="relative mb-6">
          <label htmlFor="busca-evolucao" className="sr-only">Buscar por título ou categoria</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="busca-evolucao"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar evoluções por título ou categoria..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder-gray-400 text-gray-800"
          />
        </div>

        {/* Error Message */}
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Ops!</strong>
            <span className="block sm:inline ml-2">{erro}</span>
          </div>
        )}

        {/* Evolutions Grid */}
        {carregandoEvolucoes ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-lg text-gray-600">Carregando evoluções...</p>
          </div>
        ) : evolucoesFiltradas.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">
              Nenhuma evolução encontrada com os filtros e busca atuais.
              {usuarioLogado?.tipo_usuario === 'admin' && (
                <span className="block mt-2">Que tal <button onClick={() => navigate('/criar-evolucao')} className="text-blue-600 hover:text-blue-800 font-semibold underline">criar uma nova</button>?</span>
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {evolucoesFiltradas.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between
                           transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                           border border-gray-200"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-between">
                    <span>{ev.titulo}</span>
                    {usuarioLogado?.tipo_usuario === 'colaborador' && !ev.visualizado && (
                      <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-red-100">
                        🆕 Novo
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Categoria:</span> {ev.categoria}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Criado em:</span> {new Date(ev.data_criacao).toLocaleDateString()}
                  </p>
                  {ev.criado_por_nome && ( // Se tiver o nome do criador
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Criado por:</span> {ev.criado_por_nome}
                    </p>
                  )}


                  {usuarioLogado?.tipo_usuario === 'admin' && ev.logs?.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <p className="font-bold text-gray-700 mb-3 flex items-center">
                        <History className="w-5 h-5 text-gray-500 mr-2" /> Histórico de Edição
                      </p>
                      <ul className="space-y-2">
                        {ev.logs.map(log => (
                          <li key={log.id} className="text-gray-600 flex items-start text-sm">
                            <FileText className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-gray-800 capitalize">{log.tipo}</span> por <span className="font-semibold text-gray-800">{log.usuario}</span> em{' '}
                              <span className="text-gray-500 flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1" />{new Date(log.data).toLocaleString()}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-6 text-right space-y-2 flex flex-col sm:flex-row sm:justify-end sm:items-center sm:gap-2"> {/* Layout responsivo para botões */}
                  <button
                    onClick={() => navigate(`/evolucao/${ev.id}`)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg
                               hover:bg-blue-700 transition-colors duration-200
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                               shadow-md hover:shadow-lg w-full sm:w-auto"
                  >
                    Visualizar Detalhes
                  </button>
                  {usuarioLogado?.tipo_usuario === 'admin' && (
                    <button
                      onClick={() => {
                        setEvolucaoSelecionada(ev.id);
                        setMostrarModalExcluir(true);
                      }}
                      className="text-red-600 hover:text-red-800 underline w-full sm:w-auto block text-center sm:text-right px-4 py-2.5 transition-colors duration-200"
                    >
                      Excluir Evolução
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {mostrarModalExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 sm:p-8 transform scale-95 animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Confirmar Exclusão</h3>
            <p className="text-gray-700 mb-6 text-center">
              Tem certeza que deseja excluir esta evolução? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModalExcluir(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg
                           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;