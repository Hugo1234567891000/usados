/**
 * EXEMPLO DE USO NO PROJETO A
 *
 * Este arquivo mostra como adicionar o botão de "PRONTOS" no Projeto A
 * que leva automaticamente para o Projeto B com SSO.
 *
 * IMPORTANTE: Copie os arquivos sso.ts e SSOButton.tsx para o Projeto A primeiro!
 */

import { SSOButton } from './components/SSOButton';
import { Building2, Sparkles } from 'lucide-react';

// Exemplo 1: Botões de navegação entre Lançamentos e Prontos
function NavigationButtons() {
  return (
    <div className="flex gap-4">
      {/* Botão de Lançamentos (permanece no Projeto A) */}
      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Sparkles className="w-5 h-5" />
        Lançamentos
      </button>

      {/* Botão de Prontos (leva para o Projeto B com SSO) */}
      <SSOButton
        targetUrl="http://localhost:5174" // URL do Projeto B (ajuste conforme necessário)
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Building2 className="w-5 h-5" />
        Prontos
      </SSOButton>
    </div>
  );
}

// Exemplo 2: Menu com abas
function PropertyTypeMenu() {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex gap-8">
          <a
            href="/lancamentos"
            className="py-4 px-2 border-b-2 border-blue-600 text-blue-600 font-medium"
          >
            Lançamentos
          </a>

          <SSOButton
            targetUrl="http://localhost:5174"
            className="py-4 px-2 border-b-2 border-transparent hover:border-green-600 hover:text-green-600 transition-colors"
          >
            Prontos
          </SSOButton>
        </nav>
      </div>
    </div>
  );
}

// Exemplo 3: Cards de categorias
function PropertyCategories() {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Card de Lançamentos */}
      <button className="p-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl hover:scale-105 transition-transform">
        <Sparkles className="w-12 h-12 mb-4 mx-auto" />
        <h3 className="text-2xl font-bold mb-2">Lançamentos</h3>
        <p className="text-blue-100">
          Empreendimentos novos em fase de lançamento e construção
        </p>
      </button>

      {/* Card de Prontos (com SSO) */}
      <SSOButton
        targetUrl="http://localhost:5174"
        className="p-8 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl hover:scale-105 transition-transform"
      >
        <Building2 className="w-12 h-12 mb-4 mx-auto" />
        <h3 className="text-2xl font-bold mb-2">Prontos</h3>
        <p className="text-green-100">
          Imóveis prontos para morar, disponíveis imediatamente
        </p>
      </SSOButton>
    </div>
  );
}

// Exemplo 4: Integração em página existente
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Imobiliária</h1>
            <NavigationButtons />
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Escolha o tipo de imóvel
          </h2>
          <PropertyCategories />
        </section>

        {/* Resto do conteúdo da página */}
      </main>
    </div>
  );
}

/**
 * CONFIGURAÇÃO NECESSÁRIA NO PROJETO A PARA SINCRONIZAÇÃO BIDIRECIONAL:
 *
 * 1. Copie os arquivos:
 *    - src/lib/sso.ts
 *    - src/components/SSOButton.tsx
 *    - src/components/CrossProjectLink.tsx
 *    - src/hooks/useSessionSync.ts
 *
 * 2. Atualize o AuthContext no Projeto A:
 *
 *    a) Adicione no useEffect que detecta tokens na URL (se ainda não tiver):
 *
 *    useEffect(() => {
 *      const checkUrlToken = async () => {
 *        const params = new URLSearchParams(window.location.search);
 *        const accessToken = params.get('access_token');
 *        const refreshToken = params.get('refresh_token');
 *
 *        if (accessToken && refreshToken) {
 *          await supabase.auth.setSession({
 *            access_token: accessToken,
 *            refresh_token: refreshToken,
 *          });
 *          window.history.replaceState({}, document.title, window.location.pathname);
 *        }
 *      };
 *      checkUrlToken();
 *    }, []);
 *
 *    b) Atualize a função login para enviar mensagem de sincronização:
 *
 *    const login = useCallback(async (email: string, password: string) => {
 *      const { data, error } = await supabase.auth.signInWithPassword({
 *        email,
 *        password,
 *      });
 *
 *      if (error) throw new Error(error.message);
 *
 *      if (data.user) {
 *        await loadProfile(data.user.id);
 *        setShowAuthModal(false);
 *
 *        // ADICIONE ESTAS 3 LINHAS:
 *        const channel = new BroadcastChannel('supabase-auth-sync');
 *        channel.postMessage({ type: 'session-changed', event: 'SIGNED_IN' });
 *        channel.close();
 *
 *        if (redirectAfterLogin) {
 *          navigate(redirectAfterLogin);
 *          setRedirectAfterLogin(null);
 *        }
 *      }
 *    }, [redirectAfterLogin, navigate, loadProfile]);
 *
 *    c) Atualize a função logout para enviar mensagem de sincronização:
 *
 *    const logout = useCallback(async () => {
 *      await supabase.auth.signOut();
 *      setUser(null);
 *      setProfile(null);
 *      setSession(null);
 *      setIsAuthenticated(false);
 *
 *      // ADICIONE ESTAS 3 LINHAS:
 *      const channel = new BroadcastChannel('supabase-auth-sync');
 *      channel.postMessage({ type: 'session-changed', event: 'SIGNED_OUT' });
 *      channel.close();
 *
 *      navigate('/');
 *    }, [navigate]);
 *
 * 3. Adicione o hook useSessionSync no App.tsx do Projeto A:
 *
 *    import { useSessionSync } from './hooks/useSessionSync';
 *
 *    export default function App() {
 *      useSessionSync(); // Esta linha ativa a sincronização
 *
 *      return (
 *        <Router>
 *          // ... seu código
 *        </Router>
 *      );
 *    }
 *
 * 4. Use um dos exemplos acima onde você quiser adicionar navegação para o Projeto B
 *
 * 5. Ajuste a URL do Projeto B conforme necessário:
 *    - Desenvolvimento: http://localhost:5174
 *    - Produção: https://seu-dominio-projeto-b.vercel.app
 *
 * COM ISSO CONFIGURADO:
 * ✅ Login no Projeto A → sincroniza automaticamente no Projeto B
 * ✅ Login no Projeto B → sincroniza automaticamente no Projeto A
 * ✅ Logout no Projeto A → sincroniza automaticamente no Projeto B
 * ✅ Logout no Projeto B → sincroniza automaticamente no Projeto A
 * ✅ Navegação entre projetos mantém a sessão
 * ✅ Funciona em múltiplas abas/janelas do mesmo navegador
 */

export { NavigationButtons, PropertyTypeMenu, PropertyCategories, HomePage };
