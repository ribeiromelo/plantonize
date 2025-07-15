import { useState } from 'react';
import { User, Lock, AlertCircle, Check, ClipboardList, UserPlus } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isHuman) {
      setErro('Confirme que você não é um robô.');
      setMensagem('');
      return;
    }

    setErro('');
    setMensagem('');

    try {
      await api.post('register/', {
        username,
        password,
        tipo_usuario: 'colaborador'
      });
      setMensagem('Cadastro realizado com sucesso! Você já pode fazer login no sistema.');
      setUsername('');
      setPassword('');
      setIsHuman(false);
    } catch (err) {
      console.error("Erro no registro:", err);
      setErro(err.response?.data?.error || 'Erro ao registrar. Verifique se o CRM já está cadastrado ou tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Coluna Esquerda - Formulário de Registro */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Cabeçalho */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 w-16 h-16 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plantonize</h1>
            <p className="text-gray-500">Cadastro de Colaborador</p>
          </div>

          {/* Formulário */}
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">Crie sua conta</h2>
            
            {/* Mensagens de feedback */}
            {mensagem && (
              <div className="flex items-start p-4 text-sm text-green-700 bg-green-50 rounded-lg">
                <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{mensagem}</span>
                </div>
              </div>
            )}

            {erro && (
              <div className="flex items-start p-4 text-sm text-red-700 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">{erro}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Campo Usuário */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    CRM ou Identificação
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="Digite seu CRM ou identificação"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-400 text-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Campo Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Crie uma senha segura"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-400 text-gray-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Confirmação Humana */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isHuman"
                    type="checkbox"
                    checked={isHuman}
                    onChange={() => setIsHuman(!isHuman)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    required
                  />
                </div>
                <label htmlFor="isHuman" className="ml-3 block text-sm text-gray-700">
                  Confirmo que sou um profissional de saúde
                </label>
              </div>

              {/* Botão de Registro */}
              <button
                type="submit"
                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ${!isHuman ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isHuman}
              >
                Cadastrar
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Já possui cadastro?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200"
                >
                  Acessar minha conta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna Direita - Seção Informativa */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-900 to-purple-700 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-4xl font-bold leading-tight mb-6">Sistema de Evoluções Médicas</h2>
          <p className="text-xl mb-10 opacity-90">
            Cadastre-se para gerenciar evoluções médicas de forma supervisionada e colaborativa.
          </p>
          
          {/* Benefícios */}
          <div className="space-y-6 mb-12">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-1 text-left">Registro de Evoluções</h3>
                <p className="text-sm opacity-80 text-left">
                  Documente todas as evoluções médicas de forma organizada e acessível.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold mb-1 text-left">Supervisão Garantida</h3>
                <p className="text-sm opacity-80 text-left">
                  Todas as suas evoluções serão revisadas pelo preceptor responsável.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold mb-1 text-left">Histórico Completo</h3>
                <p className="text-sm opacity-80 text-left">
                  Acesso ao histórico completo de todas as edições e alterações realizadas.
                </p>
              </div>
            </div>
          </div>
          
          {/* Nota Importante */}
          <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-filter backdrop-blur-sm border border-white border-opacity-20">
            <p className="text-sm">
              <span className="font-bold">Atenção:</span> Este cadastro é exclusivo para profissionais de saúde vinculados à instituição.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;