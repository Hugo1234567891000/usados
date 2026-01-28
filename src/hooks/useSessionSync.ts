import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export function useSessionSync() {
  const lastSessionRef = useRef<string | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel('supabase-auth-sync');

    const checkAndUpdateSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentSessionId = session?.access_token || null;

      if (currentSessionId !== lastSessionRef.current) {
        lastSessionRef.current = currentSessionId;
        window.location.reload();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('sb-') && e.key?.includes('-auth-token')) {
        checkAndUpdateSession();
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'session-changed') {
        checkAndUpdateSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndUpdateSession();
      }
    };

    const handleFocus = () => {
      checkAndUpdateSession();
    };

    window.addEventListener('storage', handleStorageChange);
    channel.addEventListener('message', handleMessage);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        channel.postMessage({ type: 'session-changed', event });

        supabase.auth.getSession().then(({ data: { session } }) => {
          lastSessionRef.current = session?.access_token || null;
        });
      }
    });

    const intervalId = setInterval(checkAndUpdateSession, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      lastSessionRef.current = session?.access_token || null;
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.removeEventListener('message', handleMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      channel.close();
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);
}
