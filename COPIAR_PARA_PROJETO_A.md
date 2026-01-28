# Arquivos para Copiar para o Projeto A

Para que a sincronização bidirecional funcione, copie os seguintes arquivos deste Projeto B para o Projeto A:

## 1. Hook de Sincronização (OBRIGATÓRIO)

**Arquivo:** `src/hooks/useSessionSync.ts`

Este hook monitora mudanças de sessão e sincroniza automaticamente entre projetos.

## 2. AuthContext Atualizado (OBRIGATÓRIO)

**Arquivo:** `src/contexts/AuthContext.tsx`

O AuthContext foi atualizado para:
- Enviar mensagens via BroadcastChannel quando faz login/logout
- Detectar tokens na URL automaticamente

## 3. CrossProjectLink Atualizado

**Arquivo:** `src/components/CrossProjectLink.tsx`

Este componente já deve estar no Projeto A, mas verifique se está atualizado.

## 4. Adicionar no App.tsx (OBRIGATÓRIO)

No arquivo `src/App.tsx` do Projeto A, adicione:

```tsx
import { useSessionSync } from './hooks/useSessionSync';

export default function App() {
  useSessionSync(); // Adicione esta linha no início da função

  return (
    // ... resto do código
  );
}
```

## Como Copiar

### Opção 1: Copiar Manualmente
1. Abra cada arquivo listado acima neste projeto
2. Copie o conteúdo completo
3. Cole no arquivo correspondente no Projeto A
4. Salve e faça build do Projeto A

### Opção 2: Via Terminal (se tiver acesso aos dois projetos localmente)
```bash
# Do diretório do Projeto B para o Projeto A
cp src/hooks/useSessionSync.ts ../projeto-a/src/hooks/
cp src/contexts/AuthContext.tsx ../projeto-a/src/contexts/
cp src/components/CrossProjectLink.tsx ../projeto-a/src/components/
```

## Verificação

Após copiar, verifique se:
1. ✅ Ambos os projetos têm o mesmo `.env` com as credenciais Supabase
2. ✅ Ambos os projetos têm o `useSessionSync()` no App.tsx
3. ✅ Ambos os projetos foram buildados novamente (`npm run build`)
4. ✅ Ambos os projetos foram deployados/recarregados

## Teste Final

1. Abra o Projeto A em uma aba
2. Abra o Projeto B em outra aba
3. Faça login no Projeto A
4. Volte para a aba do Projeto B (clique nela)
5. Aguarde até 5 segundos
6. O Projeto B deve detectar o login automaticamente e atualizar

O mesmo deve funcionar ao contrário: login no B → sincroniza no A.
