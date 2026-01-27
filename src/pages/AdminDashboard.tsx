import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Home, Users, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-gray-700">Área Administrativa</span>
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Secondary Navigation */}
        <div className="mb-8">
          <nav className="flex gap-4">
            <Link
              to="/admin/construtoras"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/admin/construtoras')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Construtoras</span>
            </Link>
            <Link
              to="/admin/empreendimentos"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/admin/empreendimentos')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Empreendimentos</span>
            </Link>
            <Link
              to="/admin/corretores"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/admin/corretores')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Corretores</span>
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <Outlet />
      </div>
    </div>
  );
}