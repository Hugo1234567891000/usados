import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

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
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  actionLabel?: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'broker' | 'developer' | 'bank' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
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
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setUser({
          name: data.full_name || data.email,
          email: data.email,
          role: data.role
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  useEffect(() => {
    const checkUrlToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error && data.session) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Error setting session from URL:', error);
        }
      }
    };

    checkUrlToken();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);

      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    const savedNotifications = localStorage.getItem('appNotifications');
    if (savedNotifications) {
      try {
        setAppNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to parse stored notifications', error);
      }
    }

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  useEffect(() => {
    if (isAuthenticated && appNotifications.length > 0) {
      localStorage.setItem('appNotifications', JSON.stringify(appNotifications));
    }
  }, [appNotifications, isAuthenticated]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      await loadProfile(data.user.id);
      setShowAuthModal(false);

      const channel = new BroadcastChannel('supabase-auth-sync');
      channel.postMessage({ type: 'session-changed', event: 'SIGNED_IN' });
      channel.close();

      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
        setRedirectAfterLogin(null);
      }
    }
  }, [redirectAfterLogin, navigate, loadProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAuthenticated(false);

    const channel = new BroadcastChannel('supabase-auth-sync');
    channel.postMessage({ type: 'session-changed', event: 'SIGNED_OUT' });
    channel.close();

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
      profile,
      session,
      loading,
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
