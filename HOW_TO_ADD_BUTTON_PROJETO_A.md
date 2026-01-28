# Como Adicionar Botão "Prontos" no Projeto A

Este guia mostra como adicionar um botão no Projeto A que redireciona para este Projeto B (Prontos), mantendo o usuário logado.

## Passo 1: Copiar Arquivos Necessários

Copie estes arquivos do **Projeto B** para o **Projeto A**:

### 1. Hook de Sincronização
Copie: `src/hooks/useSessionSync.ts`

### 2. Componente de Link Cross-Project
Copie: `src/components/CrossProjectLink.tsx`

## Passo 2: Configurar o Supabase no Projeto A

Edite o arquivo `src/lib/supabase.ts` do Projeto A:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
    storage: window.localStorage,
  },
});
```

## Passo 3: Atualizar o AuthContext no Projeto A

No arquivo `src/contexts/AuthContext.tsx` do Projeto A:

1. Adicione o import:
```typescript
import { useSessionSync } from '../hooks/useSessionSync';
```

2. Ative o hook no início do AuthProvider:
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useSessionSync(); // Adicionar esta linha

  // ... resto do código
}
```

3. Se ainda não tiver, adicione a verificação de tokens na URL:
```typescript
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
  // ... resto do código
}, []);
```

## Passo 4: Adicionar o Botão no Header

Edite o arquivo `src/components/Header.tsx` do Projeto A:

1. Adicione os imports:
```typescript
import { Home } from 'lucide-react'; // ou outro ícone que preferir
import { CrossProjectLink } from './CrossProjectLink';
```

2. Adicione o botão na navegação (ao lado do botão atual):
```typescript
<nav>
  <ul className="flex items-center gap-8">
    <li><Link to="/" className="text-gray-600 hover:text-blue-600">Início</Link></li>
    <li><Link to="/imoveis" className="text-gray-600 hover:text-blue-600">Lançamentos</Link></li>
    <li>
      <CrossProjectLink
        href="http://localhost:5174"
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        Prontos
      </CrossProjectLink>
    </li>
    {/* ... outros links ... */}
  </ul>
</nav>
```

## URLs dos Projetos

### Desenvolvimento
- **Projeto A (Lançamentos)**: http://localhost:5173
- **Projeto B (Prontos)**: http://localhost:5174

Para iniciar o Projeto B na porta 5174:
```bash
npm run dev -- --port 5174
```

### Produção (atualizar depois)
Quando publicar em produção, atualize as URLs no código:

**No Projeto A:**
```typescript
<CrossProjectLink href="https://prontos.seudominio.com">
```

**No Projeto B (já configurado):**
```typescript
<CrossProjectLink href="https://lancamentos.seudominio.com">
```

## Testando

1. Inicie ambos os projetos:
```bash
# Terminal 1 - Projeto A
cd projeto-a
npm run dev

# Terminal 2 - Projeto B
cd projeto-b
npm run dev -- --port 5174
```

2. Acesse http://localhost:5173 (Projeto A)
3. Faça login
4. Clique no botão "Prontos"
5. O Projeto B deve abrir em nova aba, já logado

## Resultado Final

- ✅ Usuário faz login em qualquer projeto
- ✅ Pode navegar entre projetos mantendo a sessão
- ✅ Logout em um projeto reflete no outro automaticamente
- ✅ Funciona em múltiplas abas/janelas
