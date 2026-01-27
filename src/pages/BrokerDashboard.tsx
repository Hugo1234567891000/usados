import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Settings, LogOut, Bell, BarChart2, Home, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function BrokerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications] = useState([
    { id: 1, title: 'Nova mensagem de cliente', read: false },
    { id: 2, title: 'Nova proposta recebida', read: false },
    { id: 3, title: 'Comissão aprovada', read: true }
  ]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">VHGold Imóveis</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-gray-700">Portal do Corretor</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex gap-4">
            <Link
              to="/corretor/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/corretor/dashboard')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/corretor/visitas"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/corretor/visitas')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Visitas</span>
            </Link>
            <Link
              to="/corretor/financeiro"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/corretor/financeiro')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Financeiro</span>
            </Link>
            <Link
              to="/corretor/perfil"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/corretor/perfil') || isActive('/corretor/assinatura')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Perfil</span>
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <Outlet />
      </div>
    </div>
  );
}