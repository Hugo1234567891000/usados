import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Instagram, Facebook, Mail, Phone, Building2, Users, Landmark, Lock, User } from 'lucide-react';

export default function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'developer' | 'broker' | 'bank' | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temporary credentials for each type
    switch (loginType) {
      case 'admin':
        if (credentials.username === 'admin' && credentials.password === 'vh@2024') {
          // Navigate directly to admin dashboard
          window.location.href = '/admin/construtoras';
          setShowLoginModal(false);
        } else {
          setError('Credenciais inválidas');
        }
        break;
      case 'developer':
        if (credentials.username === 'construtora@vhgold.com.br' && credentials.password === 'vh@2024const') {
          // Navigate directly to developer dashboard
          window.location.href = '/developer/dashboard';
          setShowLoginModal(false);
        } else {
          setError('Credenciais inválidas');
        }
        break;
      case 'broker':
        if (credentials.username === 'corretor@vhgold.com.br' && credentials.password === 'vh@2024cor') {
          // Navigate directly to broker dashboard
          window.location.href = '/corretor/dashboard';
          setShowLoginModal(false);
        } else {
          setError('Credenciais inválidas');
        }
        break;
      case 'financeira':
        if (credentials.username === 'financeira@vhgold.com.br' && credentials.password === 'vh@2024fin') {
          // Navigate directly to financial institution dashboard
          window.location.href = '/financeira/financiamento/taxas';
          setShowLoginModal(false);
        } else {
          setError('Credenciais inválidas');
        }
        break;
      case 'bank':
        if (credentials.username === 'banco@vhgold.com.br' && credentials.password === 'vh@2024bank') {
          // Navigate directly to bank dashboard
          window.location.href = '/bank/dashboard';
          setShowLoginModal(false);
        } else {
          setError('Credenciais inválidas');
        }
        break;
    }
  };

  const getLoginTitle = () => {
    switch (loginType) {
      case 'admin':
        return 'Login Administrativo';
      case 'developer':
        return 'Login Construtora';
      case 'broker':
        return 'Login Corretor';
      case 'bank':
        return 'Login Banco';
      default:
        return '';
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/trace (3) (2).svg" alt="Trace Imóveis" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-400">
              Sua imobiliária de confiança para encontrar o imóvel dos seus sonhos.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Início</Link></li>
              <li><Link to="/imoveis" className="text-gray-400 hover:text-white">Imóveis</Link></li>
              <li><Link to="/sobre" className="text-gray-400 hover:text-white">Sobre</Link></li>
              <li><Link to="/contato" className="text-gray-400 hover:text-white">Contato</Link></li>
              <li className="pt-4 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Área do Parceiro</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/cadastro/construtora" className="flex items-center gap-2 text-gray-400 hover:text-white">
                      <Building2 className="h-4 w-4" />
                      <span>Cadastro de Construtora</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/cadastro/corretor" className="flex items-center gap-2 text-gray-400 hover:text-white">
                      <Users className="h-4 w-4" />
                      <span>Cadastro de Corretor</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/cadastro/financeira" className="flex items-center gap-2 text-gray-400 hover:text-white">
                      <Landmark className="h-4 w-4" />
                      <span>Cadastro de Financeira</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="pt-4 border-t border-gray-800">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Área de Login</h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        setLoginType('developer');
                        setShowLoginModal(true);
                        setCredentials({ username: '', password: '' });
                        setError('');
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Login Construtora</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setLoginType('broker');
                        setShowLoginModal(true);
                        setCredentials({ username: '', password: '' });
                        setError('');
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white"
                    >
                      <Users className="h-4 w-4" />
                      <span>Login Corretor</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setLoginType('financeira');
                        setShowLoginModal(true);
                        setCredentials({ username: '', password: '' });
                        setError('');
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-white"
                    >
                      <Landmark className="h-4 w-4" />
                      <span>Login Financeira</span>
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-gray-400">(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-gray-400">contato@imobiliaria.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col items-center gap-4">
          <p className="text-gray-400">&copy; 2024 Trace Imóveis. Todos os direitos reservados.</p>
          <button
            onClick={() => {
              setLoginType('admin');
              setShowLoginModal(true);
              setCredentials({ username: '', password: '' });
              setError('');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Área Administrativa</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{getLoginTitle()}</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {loginType === 'admin' ? 'Usuário' : 'E-mail'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={loginType === 'admin' ? 'text' : 'email'}
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                    placeholder={loginType === 'admin' ? 'Digite seu usuário' : 'Digite seu e-mail'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
                    placeholder="Digite sua senha"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Entrar
              </button>

              {loginType !== 'admin' && (
                <div className="text-center">
                  <Link
                    to={`/cadastro/${loginType === 'developer' ? 'construtora' : loginType === 'broker' ? 'corretor' : 'banco'}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Ainda não tem cadastro? Clique aqui
                  </Link>
                </div>
              )}

              {/* Test credentials section */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Credenciais para teste:</p>
                {loginType === 'admin' && (
                  <>
                    <p className="text-sm text-gray-600">Usuário: admin</p>
                    <p className="text-sm text-gray-600">Senha: vh@2024</p>
                  </>
                )}
                {loginType === 'developer' && (
                  <>
                    <p className="text-sm text-gray-600">E-mail: construtora@vhgold.com.br</p>
                    <p className="text-sm text-gray-600">Senha: vh@2024const</p>
                  </>
                )}
                {loginType === 'broker' && (
                  <>
                    <p className="text-sm text-gray-600">E-mail: corretor@vhgold.com.br</p>
                    <p className="text-sm text-gray-600">Senha: vh@2024cor</p>
                  </>
                )}
                {loginType === 'financeira' && (
                  <>
                    <p className="text-sm text-gray-600">E-mail: financeira@vhgold.com.br</p>
                    <p className="text-sm text-gray-600">Senha: vh@2024fin</p>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}