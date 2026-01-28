# Instruções de SSO (Single Sign-On) entre Projetos

Este projeto está configurado para fazer Single Sign-On automático com outros projetos que usam o mesmo banco Supabase.

## Como funciona

1. **Login automático via URL**: Quando um usuário já autenticado em outro projeto acessa este projeto via um link especial, ele é automaticamente autenticado.

2. **Tokens na URL**: O sistema detecta os parâmetros `access_token` e `refresh_token` na URL e autentica automaticamente.

3. **Limpeza da URL**: Após autenticar, os tokens são removidos da URL por segurança.

4. **Sincronização Bidirecional**: Quando você faz login em qualquer projeto, as outras abas abertas detectam automaticamente através de:
   - BroadcastChannel (mesmo domínio)
   - Storage Events (mesmo domínio)
   - Verificação periódica a cada 5 segundos
   - Detecção quando a aba ganha foco

5. **Persistência de Sessão**: Se você faz login no Projeto A e navega para o Projeto B, sua sessão é mantida. Se você voltar para o Projeto A (aba ainda aberta), a sessão é automaticamente atualizada.

## Como usar no Projeto A (para criar link para este Projeto B)

### Opção 1: Usar o componente SSOButton

```tsx
import { SSOButton } from './components/SSOButton';

function MyComponent() {
  return (
    <SSOButton
      targetUrl="http://localhost:5173" // URL do Projeto B
      className="px-6 py-3 bg-blue-600 text-white rounded-lg"
    >
      Ver Imóveis Prontos
    </SSOButton>
  );
}
```

### Opção 2: Usar o componente SSOLink

```tsx
import { SSOLink } from './components/SSOButton';

function MyComponent() {
  return (
    <SSOLink
      targetUrl="http://localhost:5173" // URL do Projeto B
      className="text-blue-600 hover:underline"
    >
      Ver Imóveis Prontos
    </SSOLink>
  );
}
```

### Opção 3: Usar a função diretamente

```tsx
import { navigateWithSSO } from './lib/sso';

function MyComponent() {
  const handleClick = async () => {
    await navigateWithSSO('http://localhost:5173'); // URL do Projeto B
  };

  return (
    <button onClick={handleClick}>
      Ver Imóveis Prontos
    </button>
  );
}
```

### Opção 4: Gerar apenas o link (sem navegar)

```tsx
import { generateSSOLink } from './lib/sso';

function MyComponent() {
  const [ssoLink, setSsoLink] = useState('');

  useEffect(() => {
    generateSSOLink('http://localhost:5173').then(setSsoLink);
  }, []);

  return <a href={ssoLink}>Ver Imóveis Prontos</a>;
}
```

## Configuração necessária nos dois projetos

1. Ambos devem usar o mesmo banco Supabase (✓ já configurado)
2. Ambos devem ter as mesmas credenciais no `.env` (✓ já configurado)
3. Ambos devem ter o AuthContext configurado para detectar tokens na URL (✓ já configurado neste projeto)

## Copiar arquivos para o Projeto A

Copie estes arquivos do Projeto B para o Projeto A:

1. `/src/lib/sso.ts` - Funções de SSO
2. `/src/components/SSOButton.tsx` - Componentes prontos para uso

Certifique-se que o Projeto A também tenha o código de detecção de tokens na URL no AuthContext (já está implementado neste projeto).

## Exemplo completo no Projeto A

```tsx
// No componente onde você quer adicionar o botão de "PRONTOS"
import { SSOButton } from '../components/SSOButton';

function HomePage() {
  return (
    <div className="flex gap-4">
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
        Lançamentos
      </button>

      <SSOButton
        targetUrl="https://seu-projeto-b.vercel.app" // URL do Projeto B em produção
        className="px-6 py-3 bg-green-600 text-white rounded-lg"
      >
        Prontos
      </SSOButton>
    </div>
  );
}
```

## Segurança

- Os tokens são transmitidos via URL (HTTPS obrigatório em produção)
- Os tokens são automaticamente removidos da URL após uso
- O Supabase gerencia a expiração e renovação de tokens automaticamente
- Apenas usuários com sessão válida podem gerar links SSO

## Sincronização entre Projetos

### Mesmo Domínio (ou Subdomínios)
Se os projetos estão no mesmo domínio (ex: `app1.exemplo.com` e `app2.exemplo.com`):
- Sincronização é **instantânea** através de BroadcastChannel e Storage Events
- Login em um projeto atualiza imediatamente todas as abas abertas

### Domínios Diferentes
Se os projetos estão em domínios diferentes:
- Sincronização acontece através de:
  - Transferência de tokens durante navegação (instantâneo)
  - Verificação periódica a cada 5 segundos
  - Detecção quando você clica na aba
- Pode haver delay de até 5 segundos para sincronizar

## Troubleshooting

**Problema**: Login não funciona entre projetos
- Verifique se ambos usam as mesmas credenciais Supabase no `.env`
- Verifique se ambos têm o código de detecção de tokens no AuthContext
- Verifique o console do navegador por erros

**Problema**: Tokens aparecem na URL
- O sistema deve remover automaticamente após autenticar
- Se não remover, verifique se o código `window.history.replaceState` está funcionando

**Problema**: Usuário precisa fazer login novamente
- Verifique se o Supabase está configurado corretamente
- Verifique se os tokens estão sendo passados corretamente na URL
- Verifique se não há erro de CORS

**Problema**: Sessão não sincroniza entre projetos
- Se estão no mesmo domínio, verifique se o BroadcastChannel está funcionando
- Se estão em domínios diferentes, espere até 5 segundos ou clique na aba para forçar sincronização
- Verifique se ambos os projetos têm o `useSessionSync()` no App.tsx
- Verifique se ambos têm a versão atualizada do código de sincronização
