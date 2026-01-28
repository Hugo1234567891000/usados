import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Bell,
  LogOut,
  BarChart3,
  Lock,
  ChevronDown,
  Search,
  Plus,
  MapPin,
  Home,
  Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CrossProjectLink } from '../components/CrossProjectLink';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: MenuItem[];
  adminOnly?: boolean;
}

// Define menuItems before using it in useState
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/developer/dashboard'
  },
  {
    id: 'projects',
    label: 'Empreendimentos',
    icon: Building2,
    children: [
      { id: 'projects-list', label: 'Lista', icon: Building2, path: '/developer/projects' },
      { id: 'projects-new', label: '+ Apartamento', icon: Building2, path: '/developer/projects/new' },
      { id: 'projects-houses', label: '+ Casa', icon: Home, path: '/developer/projects/houses' },
      { id: 'projects-rooms', label: '+ Empresarial', icon: Building2, path: '/developer/projects/rooms' },
      { id: 'projects-lots', label: '+ Lote', icon: MapPin, path: '/developer/projects/lots' },
      { id: 'projects-map', label: 'Mapa', icon: Map, path: '/developer/projects/map' }
    ]
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: BarChart3,
    path: '/developer/reports'
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    adminOnly: true,
    children: [
      { id: 'users', label: 'Usuários', icon: Users, path: '/developer/settings/users' },
      { id: 'roles', label: 'Perfis', icon: Lock, path: '/developer/settings/roles' },
      { id: 'company', label: 'Empresa', icon: Building2, path: '/developer/settings/company' }
    ]
  }
];

export default function DeveloperPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(() => {
    const currentPath = location.pathname;
    const menuWithCurrentPath = menuItems.find(item => 
      item.children?.some(child => child.path === currentPath)
    );
    return menuWithCurrentPath?.id || null;
  });
  
  const [notifications] = useState([
    { id: 1, title: 'Nova proposta recebida', read: false },
    { id: 2, title: 'Contrato pendente de assinatura', read: false },
    { id: 3, title: 'Alerta de inadimplência', read: true }
  ]);

  // Check if current user is admin (construtora@vhgold.com.br)
  const isAdmin = true; // In a real app, this would come from auth context

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else if (item.path) {
      navigate(item.path);
      // If this is a top-level menu item, collapse all menus
      if (!item.path.includes(expandedMenu || '')) {
        setExpandedMenu(null);
      }
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const isChildActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Redirect to dashboard if accessing root developer path
  if (location.pathname === '/developer') {
    return <Navigate to="/developer/dashboard" replace />;
  }

  // Filter menu items based on admin status
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

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

            <div className="flex items-center gap-6">
              {/* Global Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <Bell className="w-6 h-6" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-gray-700">Portal da Construtora</span>
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
        {/* Sidebar Navigation */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r">
          <nav className="p-4">
            <div className="space-y-1">
              {filteredMenuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                      isMenuItemActive(item)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.children && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        expandedMenu === item.id ? 'rotate-180' : ''
                      }`} />
                    )}
                  </button>
                  
                  {item.children && expandedMenu === item.id && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleMenuClick(child)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            isChildActive(child.path || '')
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}