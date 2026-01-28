import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Heart, Settings, LogOut, User, Bell, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CrossProjectLink } from '../components/CrossProjectLink';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientDashboard() {
  const location = useLocation();
  const { logout, user, appNotifications, markAppNotificationAsRead, markAllAppNotificationsAsRead } = useAuth();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-dropdown') && !target.closest('.notifications-button')) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal_status':
        return <FileText className="w-5 h-5" />;
      case 'payment_status':
        return <DollarSign className="w-5 h-5" />;
      case 'contract_status':
        return <FileCheck className="w-5 h-5" />;
      case 'document_status':
        return <FileText className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'proposal_status':
        return 'bg-blue-100 text-blue-600';
      case 'payment_status':
        return 'bg-red-100 text-red-600';
      case 'contract_status':
        return 'bg-green-100 text-green-600';
      case 'document_status':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: ptBR });
    } catch (error) {
      return 'recentemente';
    }
  };

  const unreadNotificationsCount = appNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">VHGold Imóveis</span>
              </Link>
              <CrossProjectLink
                href="https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--31fc58ec.local-credentialless.webcontainer-api.io/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Building2 className="w-5 h-5" />
                <span>Novos</span>
              </CrossProjectLink>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative notifications-dropdown">
                <button 
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full notifications-button"
                  onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-medium">Notificações</h3>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={() => markAllAppNotificationsAsRead()}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {appNotifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhuma notificação
                        </div>
                      ) : (
                        <div className="divide-y">
                          {appNotifications
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map(notification => (
                              <div
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                                onClick={() => {
                                  markAppNotificationAsRead(notification.id);
                                  if (notification.actionUrl) {
                                    window.location.href = notification.actionUrl;
                                  }
                                  setShowNotificationsDropdown(false);
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div>
                                    <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatNotificationTime(notification.timestamp)}
                                    </p>
                                    {notification.actionLabel && (
                                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                                        {notification.actionLabel}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-gray-700">Área do Cliente</span>
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
              to="/cliente"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/cliente')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Início</span>
            </Link>
            <Link
              to="/cliente/favoritos"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/cliente/favoritos')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Favoritos</span>
            </Link>
            <Link
              to="/cliente/perfil"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/cliente/perfil')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <Outlet />
      </div>
    </div>
  );
}