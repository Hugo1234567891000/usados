# Mudanças Necessárias no AuthContext.tsx do Projeto A

## Mudança 1: Função `login`

Encontre a função `login` no AuthContext.tsx e adicione o código do BroadcastChannel:

```tsx
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

    // ADICIONE ESTAS 3 LINHAS:
    const channel = new BroadcastChannel('supabase-auth-sync');
    channel.postMessage({ type: 'session-changed', event: 'SIGNED_IN' });
    channel.close();

    if (redirectAfterLogin) {
      navigate(redirectAfterLogin);
      setRedirectAfterLogin(null);
    }
  }
}, [redirectAfterLogin, navigate, loadProfile]);
```

## Mudança 2: Função `logout`

Encontre a função `logout` no AuthContext.tsx e adicione o código do BroadcastChannel:

```tsx
const logout = useCallback(async () => {
  await supabase.auth.signOut();
  setUser(null);
  setProfile(null);
  setSession(null);
  setIsAuthenticated(false);

  // ADICIONE ESTAS 3 LINHAS:
  const channel = new BroadcastChannel('supabase-auth-sync');
  channel.postMessage({ type: 'session-changed', event: 'SIGNED_OUT' });
  channel.close();

  navigate('/');
}, [navigate]);
```

## Verificação

O AuthContext.tsx do Projeto A já deve ter o código de detecção de tokens na URL (linhas 94-113 aproximadamente). Se não tiver, copie também esta parte do Projeto B.
