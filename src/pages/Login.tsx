import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, User, Globe, Lock, FileText, Shield, AlertTriangle, Users, Landmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TestCredentials {
  role: 'client' | 'admin' | 'developer' | 'broker' | 'bank';
  email: string;
  password: string;
  redirectTo: string;
}

const TEST_CREDENTIALS: TestCredentials[] = [
  {
    role: 'client',
    email: 'cliente@teste.com',
    password: '123456',
    redirectTo: '/cliente'
  },
  {
    role: 'admin',
    email: 'admin@vhgold.com.br',
    password: 'vh@2024',
    redirectTo: '/admin/construtoras'
  },
  {
    role: 'developer',
    email: 'construtora@vhgold.com.br',
    password: 'vh@2024const',
    redirectTo: '/developer/dashboard'
  },
  {
    role: 'broker',
    email: 'corretor@vhgold.com.br',
    password: 'vh@2024cor',
    redirectTo: '/corretor/dashboard'
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'client' | 'developer' | 'broker'>('client');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const matchedCredentials = TEST_CREDENTIALS.find(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (matchedCredentials) {
        // For client role, use the context login
        if (matchedCredentials.role === 'client') {
          await login(credentials.email, credentials.password);
          navigate('/');
          return;
        }

        // Use window.location.href for direct navigation
        window.location.href = matchedCredentials.redirectTo;
      } else {
        setError('E-mail ou senha inválidos');
      }
    } catch (err) {
      setError('E-mail ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          VHGold Imóveis
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesse sua área restrita
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Role Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('client')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedRole === 'client'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-sm">Cliente</span>
              </button>
              <button
                onClick={() => setSelectedRole('developer')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedRole === 'developer'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-sm">Construtora</span>
              </button>
              <button
                onClick={() => setSelectedRole('broker')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedRole === 'broker'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Corretor</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Entrar
              </button>
            </div>

            {selectedRole !== 'client' && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Ainda não tem cadastro?{' '}
                  <a
                    href={`/cadastro/${
                      selectedRole === 'developer' ? 'construtora' :
                      selectedRole === 'broker' ? 'corretor' :
                      'corretor'
                    }`}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Cadastre-se
                  </a>
                </p>
              </div>
            )}
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowTestCredentials(!showTestCredentials)}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              {showTestCredentials ? 'Ocultar credenciais de teste' : 'Mostrar credenciais de teste'}
            </button>

            {showTestCredentials && (
              <div className="mt-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Credenciais para teste:</h3>
                <div className="space-y-3">
                  {TEST_CREDENTIALS.map((cred) => (
                    <div
                      key={cred.role}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <p className="text-sm font-medium text-gray-900 capitalize mb-1">
                        {cred.role === 'client' ? 'Cliente' :
                         cred.role === 'admin' ? 'Administrador' :
                         cred.role === 'developer' ? 'Construtora' :
                         cred.role === 'broker' ? 'Corretor' : 'Banco'}
                      </p>
                      <p className="text-sm text-gray-600">E-mail: {cred.email}</p>
                      <p className="text-sm text-gray-600">Senha: {cred.password}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}