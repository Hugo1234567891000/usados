# Guia Passo a Passo: Sincronizar Login entre Projetos

## Resumo
Você fez login no Projeto B, mas ao abrir o Projeto A, não vê as mudanças. Isso acontece porque as mudanças que eu fiz estão apenas no Projeto B. Para funcionar nos dois sentidos, você precisa aplicar as mesmas mudanças no Projeto A.

## Passo 1: Abrir o Projeto A
1. Acesse https://usados-4-duplicated-u2vm.bolt.host
2. Abra o projeto no editor Bolt
3. Certifique-se de ter acesso aos arquivos

## Passo 2: Criar/Atualizar o Hook useSessionSync

No Projeto A, crie ou atualize o arquivo: `src/hooks/useSessionSync.ts`

Copie todo o conteúdo do arquivo `src/hooks/useSessionSync.ts` deste Projeto B.

**Conteúdo completo:**
```typescript
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
```

## Passo 3: Atualizar o App.tsx do Projeto A

Abra o arquivo `src/App.tsx` no Projeto A e faça estas mudanças:

### 3.1 - Adicionar o import
No topo do arquivo, adicione:
```typescript
import { useSessionSync } from './hooks/useSessionSync';
```

### 3.2 - Usar o hook
Dentro da função App, logo no início, adicione:
```typescript
export default function App() {
  useSessionSync(); // ADICIONE ESTA LINHA

  return (
    // ... resto do código
  );
}
```

## Passo 4: Atualizar AuthContext.tsx do Projeto A

Abra o arquivo `src/contexts/AuthContext.tsx` no Projeto A.

### 4.1 - Atualizar a função login
Encontre a função `login` e adicione estas 3 linhas após `setShowAuthModal(false);`:

```typescript
const channel = new BroadcastChannel('supabase-auth-sync');
channel.postMessage({ type: 'session-changed', event: 'SIGNED_IN' });
channel.close();
```

### 4.2 - Atualizar a função logout
Encontre a função `logout` e adicione estas 3 linhas após `setIsAuthenticated(false);`:

```typescript
const channel = new BroadcastChannel('supabase-auth-sync');
channel.postMessage({ type: 'session-changed', event: 'SIGNED_OUT' });
channel.close();
```

## Passo 5: Testar

1. Certifique-se de que ambos os projetos têm o mesmo `.env` (mesmas credenciais Supabase)
2. Faça build dos dois projetos
3. Abra o Projeto A em uma aba: https://usados-4-duplicated-u2vm.bolt.host
4. Abra o Projeto B em outra aba: (seu link do Projeto B)
5. Faça login em qualquer um dos projetos
6. Vá para a outra aba e aguarde até 5 segundos ou clique nela
7. A sessão deve sincronizar automaticamente

## Verificação Final

Teste estes cenários:
- ✅ Login no A → sincroniza no B (automático)
- ✅ Login no B → sincroniza no A (automático)
- ✅ Logout no A → sincroniza no B (automático)
- ✅ Logout no B → sincroniza no A (automático)
- ✅ Navegar de A para B → mantém sessão
- ✅ Navegar de B para A → mantém sessão

## Se não funcionar

1. Verifique o console do navegador por erros
2. Verifique se ambos os projetos usam o mesmo Supabase
3. Verifique se o `useSessionSync()` está sendo chamado no App.tsx
4. Tente limpar o cache do navegador e recarregar as páginas
5. Aguarde 5 segundos após voltar para uma aba
