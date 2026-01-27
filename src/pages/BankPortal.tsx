import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RatesConfiguration from './bank/financing/RatesConfiguration';

export default function BankPortal() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Redirect to rates configuration page
  if (location.pathname === '/bank' || location.pathname === '/bank/dashboard') {
    return <Navigate to="/bank/financing/rates" replace />;
  }

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
                <Home className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-gray-700">Portal do Banco</span>
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

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <RatesConfiguration />
        </main>
      </div>
    </div>
  );
}