# Plano de Renomeação para Português (PT-BR)

Este documento define um plano em 3 fases para renomear a estrutura do projeto para português, garantindo que nenhuma funcionalidade seja quebrada durante o processo.

## 🎯 Objetivo

Traduzir nomes de pastas e arquivos para português, mantendo:
- ✅ Funcionalidade intacta
- ✅ Rotas funcionando
- ✅ Imports atualizados automaticamente
- ✅ Build e testes passando

## ⚠️ Regras de Ouro

### 1. SEMPRE usar Rename/Move do Editor
- ✅ Use a função de renomear/mover do VS Code/Cursor
- ✅ Isso atualiza imports automaticamente
- ❌ NUNCA renomeie manualmente no sistema de arquivos

### 2. SEM acentos em nomes de pastas/arquivos
- ✅ `autenticacao` (não `autenticação`)
- ✅ `analise` (não `análise`)
- ✅ `memoria` (não `memória`)
- ✅ `configuracao` (não `configuração`)

### 3. Teste APÓS cada mudança
- ✅ `npm run dev` - Verificar se roda
- ✅ `npm run build` - Verificar se compila
- ✅ `npm run lint` - Verificar se não há erros
- ✅ Navegar pelas rotas no navegador

### 4. Commits pequenos e frequentes
- ✅ Faça commit após cada pasta renomeada
- ✅ Facilita rollback se necessário
- ✅ Mensagem clara: `refactor: renomeia components/ para componentes/`

---

## 📋 Fase 1: Renomeação Segura (Pastas Internas)

**Objetivo**: Renomear apenas pastas internas, SEM tocar em rotas.

### ✅ O que PODE ser renomeado nesta fase

- ✅ `components/` → `componentes/` (CONCLUÍDO)
- ✅ `lib/` → `biblioteca/` (CONCLUÍDO)
- `hooks/` → `hooks/` (manter, termo técnico comum)
- `utils/` → `utilitarios/`
- `services/` → `servicos/`
- ✅ `types/` → `tipos/` (CONCLUÍDO)
- `constants/` → `constantes/`
- `helpers/` → `auxiliares/`

### ❌ O que NÃO pode ser renomeado nesta fase

- `app/` - **NÃO TOCAR** (contém rotas do Next.js)
- Qualquer pasta dentro de `app/` - **NÃO TOCAR** (são rotas públicas)
- Arquivos de configuração raiz (`next.config.js`, `package.json`, etc.)

### Estratégia de Execução

1. **Renomear uma pasta por vez**
2. **Verificar imports atualizados automaticamente**
3. **Rodar testes**
4. **Commit**
5. **Repetir para próxima pasta**

### Checklist de Testes - Fase 1

Após renomear cada pasta, execute:

```bash
# 1. Verificar se compila
cd apps/painel-web
npm run build

# 2. Verificar linter
npm run lint

# 3. Iniciar servidor e testar manualmente
npm run dev
```

**Testes manuais:**
- [ ] Página inicial carrega
- [ ] Navegação entre páginas funciona
- [ ] Componentes renderizam corretamente
- [ ] Não há erros no console do navegador
- [ ] Não há erros no terminal

### Exemplo de Execução

```bash
# 1. Renomear components/ para componentes/ ✅ CONCLUÍDO
# (usar Rename do editor)

# 2. Verificar imports atualizados ✅ CONCLUÍDO
# (editor deve ter atualizado automaticamente)

# 3. Testar ✅ CONCLUÍDO
npm run build
npm run lint
npm run dev

# 4. Commit
git add .
git commit -m "refactor: renomeia components/ para componentes/"
```

---

## 📋 Fase 2: Tradução de Rotas (Controlada)

**Objetivo**: Traduzir rotas do Next.js App Router com segurança.

### ⚠️ ATENÇÃO: Esta fase requer cuidado extra

Rotas são URLs públicas. Mudanças aqui afetam:
- Bookmarks de usuários
- Links compartilhados
- SEO
- Integrações externas

### Estratégia com Redirects

O Next.js permite criar redirects no `next.config.js`:

```javascript
// next.config.js
async redirects() {
  return [
    {
      source: '/login',           // Rota antiga (inglês)
      destination: '/entrar',     // Rota nova (português)
      permanent: true,            // 301 redirect (SEO)
    },
    {
      source: '/cadastro',
      destination: '/registro',
      permanent: true,
    },
    {
      source: '/analise-tempo-real',
      destination: '/analise-tempo-real', // Manter se já estiver em português
      permanent: false, // 302 se for temporário
    },
  ]
}
```

### Plano de Execução - Fase 2

1. **Criar rotas novas em português**
   - Criar novas pastas em `app/` com nomes em português
   - Copiar conteúdo das rotas antigas

2. **Adicionar redirects no `next.config.js`**
   - Manter rotas antigas funcionando via redirect

3. **Atualizar links internos**
   - Atualizar todos os `<Link>` e `router.push()`
   - Usar rotas novas em português

4. **Testar redirects**
   - Acessar rotas antigas → devem redirecionar
   - Acessar rotas novas → devem funcionar

5. **Monitorar por período**
   - Manter redirects por algumas semanas
   - Verificar logs de acesso

6. **Remover rotas antigas (opcional)**
   - Após período de transição
   - Remover pastas antigas e redirects

### Checklist de Testes - Fase 2

```bash
# 1. Build
npm run build

# 2. Lint
npm run lint

# 3. Testar servidor
npm run dev
```

**Testes manuais:**
- [ ] Rota antiga redireciona para nova (ex: `/login` → `/entrar`)
- [ ] Rota nova funciona diretamente (ex: `/entrar`)
- [ ] Links internos usam rotas novas
- [ ] Navegação funciona em todas as páginas
- [ ] Não há erros 404
- [ ] Console do navegador sem erros

### Exemplo de Tabela de Rotas

| Rota Antiga (Inglês) | Rota Nova (Português) | Redirect |
|---------------------|----------------------|----------|
| `/login` | `/entrar` | ✅ Sim |
| `/cadastro` | `/registro` | ✅ Sim |
| `/analise-tempo-real` | `/analise-tempo-real` | ❌ Já em português |
| `/dashboard` | `/painel` | ✅ Sim (futuro) |
| `/settings` | `/configuracoes` | ✅ Sim (futuro) |

---

## 📋 Fase 3: Polimento e Padronização

**Objetivo**: Padronizar nomes de componentes e estrutura final.

### Padrões Definidos

#### Componentes React (PascalCase)
- ✅ Manter PascalCase: `Header.tsx`, `LoginForm.tsx`
- ✅ Traduzir nomes: `Header.tsx` → `Cabecalho.tsx` (opcional)
- ✅ Ou manter nomes técnicos se forem claros

#### Pastas (kebab-case)
- ✅ `componentes/` (não `Componentes/`)
- ✅ `analise-tempo-real/` (não `analiseTempoReal/`)
- ✅ `dados-mercado/` (não `dadosMercado/`)

#### Arquivos de Código
- ✅ Componentes: PascalCase (`LoginForm.tsx`)
- ✅ Utilitários: camelCase (`validacao.ts`)
- ✅ Configuração: kebab-case ou camelCase (`next.config.js`)

### Estratégia de Execução - Fase 3

1. **Revisar nomes de componentes**
   - Decidir: traduzir ou manter em inglês?
   - Padronizar escolha

2. **Padronizar estrutura de pastas**
   - Garantir kebab-case em todas as pastas
   - Verificar consistência

3. **Atualizar documentação**
   - Atualizar READMEs
   - Atualizar documentação de arquitetura

4. **Revisão final**
   - Verificar imports
   - Verificar exports
   - Verificar paths

### Checklist de Testes - Fase 3

```bash
# 1. Build completo
npm run build

# 2. Lint completo
npm run lint

# 3. Testes de tipo (TypeScript)
npm run type-check  # se existir

# 4. Servidor
npm run dev
```

**Testes manuais:**
- [ ] Todos os componentes importam corretamente
- [ ] Não há erros de TypeScript
- [ ] Estrutura de pastas consistente
- [ ] Documentação atualizada

---

## 📊 Tabela de Exemplos: ANTES → DEPOIS

| Tipo | ANTES (Inglês) | DEPOIS (Português) | Fase | Status |
|------|---------------|-------------------|------|--------|
| **Pasta de Componentes** | `components/` | `componentes/` | 1 | ✅ CONCLUÍDO |
| **Pasta de Utilitários** | `utils/` | `utilitarios/` | 1 | ⏳ Pendente |
| **Pasta de Tipos** | `types/` | `tipos/` | 1 | ✅ CONCLUÍDO |
| **Pasta de Serviços** | `services/` | `servicos/` | 1 | ⏳ Pendente |
| **Pasta de Constantes** | `constants/` | `constantes/` | 1 | ⏳ Pendente |
| **Pasta de Helpers** | `helpers/` | `auxiliares/` | 1 | ⏳ Pendente |
| **Pasta de Hooks** | `hooks/` | `hooks/` | 1 | ✅ Manter |
| **Pasta de Biblioteca** | `lib/` | `biblioteca/` | 1 | ✅ CONCLUÍDO |
| **Rota de Login** | `app/login/` | `app/entrar/` | 2 | ⏳ Pendente |
| **Rota de Cadastro** | `app/cadastro/` | `app/registro/` | 2 | ⏳ Pendente |
| **Componente Header** | `components/Header.tsx` | `componentes/Cabecalho.tsx` | 3 | ⏳ Opcional |
| **Componente LoginForm** | `components/auth/LoginForm.tsx` | `componentes/auth/FormularioLogin.tsx` | 3 | ⏳ Opcional |
| **Utilitário de Validação** | `lib/auth/validation.ts` | `biblioteca/auth/validacao.ts` | 1 | ✅ CONCLUÍDO |
| **Tipos de Autenticação** | `types/auth.ts` | `tipos/autenticacao.ts` | 1 | ✅ CONCLUÍDO |
| **Serviço de API** | `services/api.ts` | `servicos/api.ts` | 1 | ⏳ Pendente |
| **Constantes de Config** | `constants/config.ts` | `constantes/configuracao.ts` | 1 | ⏳ Pendente |
| **Helper de Formatação** | `helpers/format.ts` | `auxiliares/formatacao.ts` | 1 | ⏳ Pendente |
| **Hook Customizado** | `hooks/useAuth.ts` | `hooks/useAutenticacao.ts` | 3 | ⏳ Opcional |
| **Pasta de Análise** | `components/AnaliseTempoReal/` | `componentes/AnaliseTempoReal/` | 1 | ✅ CONCLUÍDO |
| **Pasta de Dados** | `services/marketData/` | `servicos/dados-mercado/` | 1 | ⏳ Pendente |

---

## 🔍 Checklist Completo de Testes

### Após Cada Mudança Individual

```bash
# 1. Verificar compilação
cd apps/painel-web
npm run build

# 2. Verificar linter
npm run lint

# 3. Iniciar servidor
npm run dev
```

**Testes no navegador:**
- [ ] Página inicial carrega
- [ ] Navegação funciona
- [ ] Componentes renderizam
- [ ] Sem erros no console
- [ ] Sem erros no terminal

### Após Cada Fase Completa

```bash
# 1. Build de produção
npm run build

# 2. Testar build de produção
npm run start

# 3. Lint completo
npm run lint

# 4. Verificar tipos TypeScript
npx tsc --noEmit
```

**Testes completos:**
- [ ] Todas as rotas funcionam
- [ ] Todos os componentes funcionam
- [ ] Imports corretos
- [ ] Sem erros de TypeScript
- [ ] Sem warnings do linter
- [ ] Build de produção funciona

---

## 📝 Exemplo de Commits

### Fase 1 - Renomeação de Pastas

```bash
# Commit 1: Renomear components/ ✅ CONCLUÍDO
git add .
git commit -m "refactor: renomeia components/ para componentes/"

# Commit 2: Renomear lib/ ✅ CONCLUÍDO
git add .
git commit -m "refactor: renomeia lib/ para biblioteca/"

# Commit 3: Renomear types/ ✅ CONCLUÍDO
git add .
git commit -m "refactor: renomeia types/ para tipos/"
```

### Fase 2 - Tradução de Rotas

```bash
# Commit 1: Adicionar redirects
git add next.config.js
git commit -m "feat: adiciona redirects para rotas em português"

# Commit 2: Criar rotas novas
git add app/entrar/ app/registro/
git commit -m "feat: cria rotas em português (entrar, registro)"

# Commit 3: Atualizar links internos
git add .
git commit -m "refactor: atualiza links internos para rotas em português"
```

### Fase 3 - Polimento

```bash
# Commit 1: Padronizar estrutura
git add .
git commit -m "refactor: padroniza estrutura de pastas (kebab-case)"

# Commit 2: Atualizar documentação
git add docs/
git commit -m "docs: atualiza documentação com novos nomes"
```

---

## ⚠️ Armadilhas Comuns e Como Evitar

### 1. Imports não atualizados
**Problema**: Renomear manualmente no sistema de arquivos não atualiza imports.

**Solução**: ✅ Sempre usar Rename/Move do editor.

### 2. Rotas quebradas
**Problema**: Renomear pastas em `app/` quebra URLs públicas.

**Solução**: ✅ Fase 2: usar redirects antes de remover rotas antigas.

### 3. Cache do Next.js
**Problema**: `.next/` pode ter cache de rotas antigas.

**Solução**: 
```bash
# Limpar cache após mudanças em rotas
rm -rf .next
npm run dev
```

### 4. Imports absolutos quebrados
**Problema**: `@/componentes` (anteriormente `@/components`) pode não atualizar automaticamente.

**Solução**: 
- Verificar `tsconfig.json` paths
- Atualizar manualmente se necessário

### 5. Testes quebrados
**Problema**: Testes podem ter paths hardcoded.

**Solução**: 
- Atualizar paths nos testes
- Usar variáveis de ambiente para paths

---

## 📚 Referências

- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [VS Code Rename Symbol](https://code.visualstudio.com/docs/editor/refactoring#_rename-symbol)

---

## 🎯 Resumo das Fases

| Fase | O que Renomear | Risco | Tempo Estimado |
|------|---------------|-------|----------------|
| **Fase 1** | Pastas internas (`components/`, `lib/`, etc.) | 🟢 Baixo | 1-2 horas |
| **Fase 2** | Rotas (`app/login/`, etc.) | 🟡 Médio | 2-4 horas |
| **Fase 3** | Componentes e padronização | 🟢 Baixo | 1-2 horas |

**Total estimado**: 4-8 horas (com testes)

---

**Última atualização**: 2025-01-27  
**Versão**: 1.0
