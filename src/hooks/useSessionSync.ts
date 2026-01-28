import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSessionSync() {
  useEffect(() => {
    const channel = new BroadcastChannel('supabase-auth-sync');

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sb-auth-token' && e.newValue !== e.oldValue) {
        window.location.reload();
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'session-changed') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    channel.addEventListener('message', handleMessage);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        channel.postMessage({ type: 'session-changed', event });
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.removeEventListener('message', handleMessage);
      channel.close();
      subscription.unsubscribe();
    };
  }, []);
}
