import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type NotificationType = 
  | 'proposal_status' 
  | 'payment_status' 
  | 'contract_status' 
  | 'document_status'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  entityId?: string; // ID of related entity (proposal, payment, contract, etc.)
  entityType?: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (path: string | null) => void;
  user: {
    name: string;
    email: string;
    role: 'client' | 'broker' | 'developer' | 'bank' | 'admin';
  } | null;
  appNotifications: AppNotification[];
  addAppNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAppNotificationAsRead: (id: string) => void;
  markAllAppNotificationsAsRead: () => void;
  clearAppNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }

    // Load saved notifications
    const savedNotifications = localStorage.getItem('appNotifications');
    if (savedNotifications) {
      try {
        setAppNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to parse stored notifications', error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (isAuthenticated && appNotifications.length > 0) {
      localStorage.setItem('appNotifications', JSON.stringify(appNotifications));
    }
  }, [appNotifications, isAuthenticated]);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test credentials
    if (email === 'cliente@teste.com' && password === '123456') {
      const userData = {
        name: 'João Silva',
        email: 'cliente@teste.com',
        role: 'client' as const
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      
      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
        setRedirectAfterLogin(null);
      }
    } else {
      throw new Error('Credenciais inválidas');
    }
  }, [redirectAfterLogin, navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  }, [navigate]);

  const addAppNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setAppNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAppNotificationAsRead = useCallback((id: string) => {
    setAppNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAppNotificationsAsRead = useCallback(() => {
    setAppNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearAppNotifications = useCallback(() => {
    setAppNotifications([]);
    localStorage.removeItem('appNotifications');
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      showAuthModal,
      setShowAuthModal,
      redirectAfterLogin,
      setRedirectAfterLogin,
      user,
      appNotifications,
      addAppNotification,
      markAppNotificationAsRead,
      markAllAppNotificationsAsRead,
      clearAppNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}