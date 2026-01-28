import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Lock, Mail, X, LogOut, ChevronDown, Globe, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CrossProjectLink } from './CrossProjectLink';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, showAuthModal, setShowAuthModal } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'pt';
  });
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Test credentials
    if (credentials.email === 'cliente@teste.com' && credentials.password === '123456') {
      setShowAuthModal(false);
      // Navigate directly to the client dashboard
      window.location.href = '/cliente';
    } else {
      setError('E-mail ou senha inválidos');
    }
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    localStorage.setItem('appLanguage', langCode);
    setShowLanguageMenu(false);
    // In a real app, you would trigger a re-render with the new language
    // For now, we'll just store the preference
  };

  const getLanguageFlag = (langCode: string) => {
    switch (langCode) {
      case 'pt': return '🇧🇷';
      case 'en': return '🇺🇸';
      case 'es': return '🇪🇸';
      default: return '🇧🇷';
    }
  };

  const getLanguageName = (langCode: string) => {
    switch (langCode) {
      case 'pt': return 'Português';
      case 'en': return 'English';
      case 'es': return 'Español';
      default: return 'Português';
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/trace (3) (2).svg" alt="Trace Imóveis" className="h-10 w-auto" />
          </Link>
          
          <div className="flex items-center gap-8">
            <nav>
              <ul className="flex items-center gap-8">
                <li>
                  <CrossProjectLink
                    href="http://localhost:5173"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    Novos
                  </CrossProjectLink>
                </li>
                <li><Link to="/" className="text-gray-600 hover:text-blue-600">Início</Link></li>
                <li><Link to="/imoveis" className="text-gray-600 hover:text-blue-600">Imóveis</Link></li>
                <li><Link to="/sobre" className="text-gray-600 hover:text-blue-600">Sobre</Link></li>
                <li><Link to="/contato" className="text-gray-600 hover:text-blue-600">Contato</Link></li>
              </ul>
            </nav>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{user?.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link 
                      to="/cliente" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Área do Cliente
                    </Link>
                    <Link 
                      to="/cliente/favoritos" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Meus Favoritos
                    </Link>
                    <Link 
                      to="/cliente/perfil" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Configurações
                    </Link>
                    <div className="border-t my-1"></div>
                    <button 
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Área do Cliente</span>
              </button>
            )}

            {/* Language Selector - Smaller and on the right */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span className="text-sm">{getLanguageFlag(selectedLanguage)}</span>
                <span className="text-xs font-medium">{selectedLanguage.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-20 border">
                  <button
                    onClick={() => handleLanguageChange('pt')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                      selectedLanguage === 'pt' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-sm">🇧🇷</span>
                    <span className="text-sm">Português</span>
                    {selectedLanguage === 'pt' && <span className="ml-auto text-blue-600 text-xs">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                      selectedLanguage === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-sm">🇺🇸</span>
                    <span className="text-sm">English</span>
                    {selectedLanguage === 'en' && <span className="ml-auto text-blue-600 text-xs">✓</span>}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('es')}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors ${
                      selectedLanguage === 'es' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-sm">🇪🇸</span>
                    <span className="text-sm">Español</span>
                    {selectedLanguage === 'es' && <span className="ml-auto text-blue-600 text-xs">✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Área do Cliente</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
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
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Digite seu e-mail"
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
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Digite sua senha"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Lembrar-me</span>
                </label>

                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Entrar
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Ainda não tem uma conta?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cadastre-se
                  </button>
                </p>
              </div>
            </form>

            {/* Test Account Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Conta para teste:</p>
              <p className="text-sm text-gray-600">E-mail: cliente@teste.com</p>
              <p className="text-sm text-gray-600">Senha: 123456</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}