import { useState, useContext } from 'react';
import { Lock, User, AlertCircle, ClipboardList, ClipboardCheck, UserCog } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setIsSubmitting(true);
        try {
            const response = await api.post('token/', {
                username,
                password
            });
            login(response.data.access, { username });
            navigate("/dashboard");
        } catch (err) {
            console.error("Erro no login:", err);
            setErro('Credenciais inválidas. Verifique seu usuário e senha.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
            {/* Coluna Esquerda - Formulário de Login */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Cabeçalho */}
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 w-16 h-16 rounded-2xl mb-4 shadow-lg">
                            <ClipboardCheck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plantonize</h1>
                        <p className="text-gray-500">Gestão de Evoluções Médicas Supervisionadas</p>
                    </div>

                    {/* Formulário */}
                    <div className="mt-8 space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900 text-center">Acesso ao Sistema</h2>
                        
                        {erro && (
                            <div className="flex items-start p-4 text-sm text-red-700 bg-red-50 rounded-lg" role="alert">
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
                                            placeholder="Digite seu CRM ou ID"
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
                                            placeholder="Digite sua senha"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-400 text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Manter conectado
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                        Esqueceu a senha?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Acessando...
                                        </>
                                    ) : 'Acessar Sistema'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Primeiro acesso?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/register"
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200"
                                >
                                    Solicitar Cadastro
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coluna Direita - Seção de Boas-Vindas */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-900 to-purple-700 flex-col items-center justify-center p-12 text-white">
                <div className="max-w-lg mx-auto text-center">
                    <h2 className="text-4xl font-bold leading-tight mb-6">Gestão Colaborativa de Evoluções Médicas</h2>
                    <p className="text-xl mb-10 opacity-90">
                        Sistema especializado para preceptores e internos com controle de acesso diferenciado e histórico completo de edições.
                    </p>
                    
                    {/* Cards de Funcionalidades */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-white border-opacity-20">
                            <UserCog className="w-8 h-8 mb-3 mx-auto text-purple-200" />
                            <h3 className="font-bold mb-1">Para Preceptores</h3>
                            <p className="text-sm opacity-80">
                                Crie, atribua e acompanhe todas as evoluções com histórico completo de alterações.
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-filter backdrop-blur-sm border border-white border-opacity-20">
                            <ClipboardList className="w-8 h-8 mb-3 mx-auto text-purple-200" />
                            <h3 className="font-bold mb-1">Para Internos</h3>
                            <p className="text-sm opacity-80">
                                Acesse apenas as evoluções atribuídas a você e registre as informações necessárias.
                            </p>
                        </div>
                    </div>
                    
                    {/* Destaques */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="bg-white bg-opacity-10 p-3 rounded-lg backdrop-filter backdrop-blur-sm">
                            <div className="text-xl font-bold mb-1">100%</div>
                            <div className="text-xs opacity-80">Seguro</div>
                        </div>
                        <div className="bg-white bg-opacity-10 p-3 rounded-lg backdrop-filter backdrop-blur-sm">
                            <div className="text-xl font-bold mb-1">24/7</div>
                            <div className="text-xs opacity-80">Disponível</div>
                        </div>
                        <div className="bg-white bg-opacity-10 p-3 rounded-lg backdrop-filter backdrop-blur-sm">
                            <div className="text-xl font-bold mb-1">IA</div>
                            <div className="text-xs opacity-80">Em Breve</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;