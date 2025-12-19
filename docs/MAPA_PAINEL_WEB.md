# Mapa Completo do Painel Web - DVAiS Mentor IA

## 1. Visão Rápida

### O que é este app

O **Painel Web** é a interface frontend do DVAiS Mentor IA, uma plataforma de mentoria inteligente para investimentos. É uma aplicação Next.js 14 com App Router que serve como ponto de entrada para usuários interagirem com o sistema de IA.

**Tecnologias principais:**
- Next.js 14 (App Router)
- React 18.2
- TypeScript 5.2
- Tailwind CSS 3.3
- TensorFlow.js (WebAssembly)
- PWA (Progressive Web App)

### Entry Principal

**Layout raiz:** `app/layout.tsx`
- Define estrutura HTML base
- Configura fontes (Inter, Poppins)
- Inclui CSS global e crítico inline
- Renderiza componentes globais (Comets, FixedLogo)
- Configura metadata e SEO

**Página inicial:** `app/page.tsx`
- Rota: `/`
- Componentes: Header, Hero, Features (lazy), Stats (lazy), Footer (lazy)
- Server Component (sem 'use client')

### Como Rodar

Consulte `docs/COMO_RODAR.md` para instruções completas.

**Comandos rápidos:**
```bash
cd apps/painel-web
npm install
npm run dev      # Desenvolvimento
npm run build    # Build de produção
```

---

## 2. Árvore de Pastas (até 4 níveis)

```
apps/painel-web/
│
├── app/                          [NÚCLEO] - Rotas Next.js App Router
│   ├── layout.tsx                Entry principal, layout raiz
│   ├── page.tsx                  Página inicial (/)
│   ├── globals.css               Estilos globais
│   ├── critical.css              CSS crítico inline
│   │
│   ├── login/                    [NÚCLEO] - Rota /login
│   │   └── page.tsx
│   │
│   ├── cadastro/                 [NÚCLEO] - Rota /cadastro
│   │   └── page.tsx
│   │
│   ├── analise-tempo-real/       [NÚCLEO] - Rota /analise-tempo-real
│   │   └── page.tsx
│   │
│   └── components/               [APOIO] - Componentes específicos de app
│       └── WebVitals.tsx        (desabilitado)
│
├── componentes/                    [NÚCLEO] - Componentes React reutilizáveis
│   ├── Header.tsx                Cabeçalho fixo com navegação
│   ├── Footer.tsx                Rodapé
│   ├── Hero.tsx                  Hero da página inicial
│   ├── Features.tsx              Seção de funcionalidades
│   ├── Stats.tsx                 Estatísticas
│   ├── Comets.tsx                Efeitos visuais (cometas)
│   ├── FixedLogo.tsx             Logo fixo no topo
│   ├── AnimatedEye.tsx           Olho animado
│   ├── Icon.tsx                  Wrapper para FontAwesome
│   ├── AIIcon.tsx                Ícone de IA
│   ├── AIProcessor.tsx           Processador de IA (WASM)
│   │
│   ├── auth/                     [NÚCLEO] - Componentes de autenticação
│   │   ├── LoginForm.tsx         Formulário de login
│   │   ├── RegisterForm.tsx      Formulário de cadastro
│   │   ├── OAuthButtons.tsx      Botões OAuth
│   │   ├── PasswordStrength.tsx  Validação de senha
│   │   └── PhoneInput.tsx        Input de telefone
│   │
│   └── AnaliseTempoReal/         [NÚCLEO] - Componentes de análise
│       ├── Hero.tsx              Hero da página de análise
│       ├── DadosCorretoras.tsx   Dados de corretoras
│       ├── DadosExclusivos.tsx   Dados exclusivos
│       ├── VantagemCompetitiva.tsx
│       ├── VantagemCompetitivaReal.tsx
│       ├── PublicoAlvo.tsx       Público-alvo
│       └── MoedaGirando.tsx      (não encontrado)
│
├── biblioteca/                          [NÚCLEO] - Bibliotecas e utilitários
│   ├── ai/                       Processamento de IA
│   │   ├── config.ts             Configuração de IA
│   │   ├── models.ts             Modelos de IA
│   │   └── useAI.ts              Hook React para IA
│   │
│   └── auth/                     Validação de autenticação
│       └── validation.ts         Validações de formulários
│
├── tipos/                        [APOIO] - Definições TypeScript
│   └── auth.ts                   Tipos de autenticação
│
├── public/                       [NÚCLEO] - Assets estáticos
│   ├── ai-head.png               Imagem do avatar
│   ├── manifest.json             PWA manifest
│   ├── sw.js                     Service Worker
│   ├── workbox-*.js              Workbox (PWA)
│   │
│   └── tfjs-wasm/                [NÚCLEO] - WebAssembly TensorFlow
│       ├── tfjs-backend-wasm.wasm
│       ├── tfjs-backend-wasm-simd.wasm
│       └── tfjs-backend-wasm-threaded-simd.wasm
│
├── imagens/                      [APOIO] - Imagens de documentação
│   └── Imagem robo Inteligencia Artificial.png
│
├── .vscode/                      [APOIO] - Configurações VS Code
│   ├── settings.json
│   ├── tasks.json
│   ├── keybindings.json
│   └── extensions.json
│
├── next.config.js                [NÚCLEO] - Configuração Next.js
├── tsconfig.json                 [NÚCLEO] - Configuração TypeScript
├── tailwind.config.js            [NÚCLEO] - Configuração Tailwind
├── postcss.config.js             [NÚCLEO] - Configuração PostCSS
├── security-headers.config.js    [NÚCLEO] - Headers de segurança
├── package.json                  [NÚCLEO] - Dependências
└── .gitignore                    [APOIO] - Git ignore
```

**Legenda:**
- **[NÚCLEO]**: Arquivos essenciais para funcionamento do app
- **[APOIO]**: Arquivos de configuração, documentação ou assets secundários

---

## 3. Mapa de Rotas

### Rota: `/` (Página Inicial)

**Arquivos:**
- `app/page.tsx` - Server Component
- `app/layout.tsx` - Layout raiz

**Componentes:**
- Header (fixo)
- Hero (above the fold)
- Features (lazy loaded)
- Stats (lazy loaded)
- Footer (lazy loaded)

**Status:** ✅ MVP

---

### Rota: `/login`

**Arquivos:**
- `app/login/page.tsx` - Server Component

**Componentes:**
- FixedLogo
- LoginForm (Client Component)
- Icon

**Status:** ✅ MVP

---

### Rota: `/cadastro`

**Arquivos:**
- `app/cadastro/page.tsx` - Server Component

**Componentes:**
- FixedLogo
- RegisterForm (Client Component)
- Icon

**Status:** ✅ MVP

---

### Rota: `/analise-tempo-real`

**Arquivos:**
- `app/analise-tempo-real/page.tsx` - Server Component
- Metadata configurada para SEO

**Componentes:**
- FixedLogo
- AnaliseHero (above the fold)
- PublicoAlvo (lazy loaded)
- DadosCorretoras (lazy loaded)
- DadosExclusivos (lazy loaded)
- VantagemCompetitivaReal (lazy loaded)
- VantagemCompetitiva (lazy loaded)

**Status:** ✅ MVP

---

### Rotas Não Encontradas

- `loading.tsx` - Não encontrado (sem loading states customizados)
- `error.tsx` - Não encontrado (sem error boundaries customizados)
- `route.ts` - Não encontrado (sem API routes nesta estrutura)

---

## 4. Mapa de Componentes por "Órgão"

### UI/Seções (Componentes de Layout)

| Arquivo | Descrição |
|---------|-----------|
| `componentes/Header.tsx` | Cabeçalho fixo com navegação, menu mobile, efeito de scroll |
| `componentes/Footer.tsx` | Rodapé com links e informações |
| `componentes/Hero.tsx` | Seção hero da página inicial com CTA |
| `componentes/Features.tsx` | Seção de funcionalidades principais |
| `componentes/Stats.tsx` | Estatísticas da plataforma |
| `componentes/FixedLogo.tsx` | Logo fixo no topo (não se move no scroll) |
| `componentes/Icon.tsx` | Wrapper para ícones FontAwesome |

**Total:** 7 componentes

---

### Autenticação

| Arquivo | Descrição |
|---------|-----------|
| `componentes/auth/LoginForm.tsx` | Formulário de login com validação client-side |
| `componentes/auth/RegisterForm.tsx` | Formulário de cadastro com validação completa |
| `componentes/auth/OAuthButtons.tsx` | Botões de login social (Google, Facebook, etc.) |
| `componentes/auth/PasswordStrength.tsx` | Indicador visual de força da senha |
| `componentes/auth/PhoneInput.tsx` | Input de telefone com máscara e validação |
| `biblioteca/auth/validation.ts` | Funções de validação (email, senha, CPF, CNPJ) |
| `tipos/auth.ts` | Tipos TypeScript para autenticação |

**Total:** 7 arquivos (5 componentes + 1 lib + 1 tipo)

---

### IA (Processamento e Configuração)

| Arquivo | Descrição |
|---------|-----------|
| `componentes/AIProcessor.tsx` | Componente visual de status da IA (LED indicador) |
| `componentes/AIIcon.tsx` | Ícone de IA |
| `biblioteca/ai/config.ts` | Configuração do backend de IA (WASM, SIMD) |
| `biblioteca/ai/models.ts` | Modelos de IA (estrutura) |
| `biblioteca/ai/useAI.ts` | Hook React para processar IA com WebAssembly |
| `public/tfjs-wasm/*.wasm` | Arquivos WebAssembly do TensorFlow.js (3 arquivos) |

**Total:** 6 arquivos (3 componentes + 3 libs) + 3 arquivos WASM

---

### Efeitos Visuais

| Arquivo | Descrição |
|---------|-----------|
| `componentes/Comets.tsx` | Cometas animados no fundo (canvas, requestAnimationFrame) |
| `componentes/AnimatedEye.tsx` | Olho animado com pupila se movendo (requestAnimationFrame) |
| `componentes/MoedaGirando.tsx` | (não encontrado) |

**Total:** 2 componentes encontrados

---

### Análise em Tempo Real

| Arquivo | Descrição |
|---------|-----------|
| `componentes/AnaliseTempoReal/Hero.tsx` | Hero da página de análise |
| `componentes/AnaliseTempoReal/DadosCorretoras.tsx` | Seção com dados básicos das corretoras |
| `componentes/AnaliseTempoReal/DadosExclusivos.tsx` | Seção com dados exclusivos do Mentor IA |
| `componentes/AnaliseTempoReal/VantagemCompetitiva.tsx` | Vantagens competitivas |
| `componentes/AnaliseTempoReal/VantagemCompetitivaReal.tsx` | Vantagens competitivas (versão alternativa) |
| `componentes/AnaliseTempoReal/PublicoAlvo.tsx` | Público-alvo do serviço |

**Total:** 6 componentes

---

### PWA (Progressive Web App)

| Arquivo | Descrição |
|---------|-----------|
| `public/manifest.json` | Manifest do PWA (nome, ícones, tema) |
| `public/sw.js` | Service Worker (cache, offline) |
| `public/workbox-*.js` | Workbox (biblioteca PWA, gerado automaticamente) |
| `next.config.js` | Configuração PWA (apenas em produção) |

**Total:** 3 arquivos + configuração

---

## 5. Inventário de Performance (Caça Gargalos)

### Arquivos com 'use client'

| Arquivo | Motivo | Impacto |
|---------|--------|---------|
| `componentes/Comets.tsx` | Canvas, mouse listeners, requestAnimationFrame | 🟡 Médio (animação contínua) |
| `componentes/AnimatedEye.tsx` | requestAnimationFrame para animação | 🟢 Baixo (animação simples) |
| `componentes/Header.tsx` | Scroll listener, estado de menu mobile | 🟢 Baixo (listener otimizado) |
| `componentes/auth/LoginForm.tsx` | useState, validação em tempo real | 🟢 Baixo (necessário) |
| `componentes/auth/RegisterForm.tsx` | useState, validação complexa | 🟢 Baixo (necessário) |
| `componentes/AIProcessor.tsx` | Hook useAI, estado de inicialização | 🟢 Baixo (necessário) |
| `biblioteca/ai/useAI.ts` | Hook React com estado | 🟢 Baixo (necessário) |

**Total:** 7 arquivos com 'use client'

**Análise:** Todos os 'use client' são justificados (hooks, eventos, animações). Nenhum uso desnecessário detectado.

---

### Listeners e Animações

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `componentes/Comets.tsx` | `addEventListener('mousemove')` | Rastreia posição do mouse para cometas |
| `componentes/Comets.tsx` | `requestAnimationFrame` | Loop de animação contínuo |
| `componentes/Header.tsx` | `addEventListener('scroll')` | Detecta scroll para mudar estilo |
| `componentes/AnimatedEye.tsx` | `requestAnimationFrame` | Anima pupila do olho |

**Total:** 4 listeners/animações

**Observações:**
- Comets.tsx: Loop contínuo pode ser pesado. Considerar throttling ou desabilitar em mobile.
- Header.tsx: Scroll listener pode ser otimizado com Intersection Observer.

---

### Imports Potencialmente Pesados

| Import | Arquivo | Tamanho Estimado | Impacto |
|--------|---------|------------------|---------|
| `@tensorflow/tfjs` | `biblioteca/ai/config.ts` | ~500KB+ | 🔴 Alto (mas lazy loaded) |
| `@tensorflow/tfjs-backend-wasm` | `biblioteca/ai/config.ts` | ~200KB+ | 🟡 Médio (mas lazy loaded) |
| `@fortawesome/*` | Vários componentes | ~100KB+ | 🟡 Médio (mas otimizado) |
| `react-phone-number-input` | `componentes/auth/PhoneInput.tsx` | ~50KB | 🟢 Baixo |
| `libphonenumber-js` | `componentes/auth/PhoneInput.tsx` | ~200KB+ | 🟡 Médio |
| `country-flag-icons` | `componentes/auth/PhoneInput.tsx` | ~100KB+ | 🟡 Médio |

**Total:** 6 imports pesados identificados

**Observações:**
- TensorFlow.js: Lazy loaded via `useAI`, não bloqueia inicialização
- FontAwesome: Self-hosted, otimizado
- PhoneInput: Carrega apenas na página de cadastro

---

### TOP 10 Suspeitos de Custo (JS/Bundle/CPU)

| # | Arquivo/Componente | Tipo de Custo | Motivo | Ação Recomendada |
|---|-------------------|---------------|--------|------------------|
| 1 | `componentes/Comets.tsx` | CPU | Loop contínuo com requestAnimationFrame + canvas | Throttle ou desabilitar em mobile, usar CSS animations se possível |
| 2 | `@tensorflow/tfjs` | Bundle | Biblioteca grande (~500KB+) | ✅ Já lazy loaded via useAI |
| 3 | `biblioteca/ai/useAI.ts` | Bundle | Importa TensorFlow.js | ✅ Já otimizado (lazy loading) |
| 4 | `componentes/auth/PhoneInput.tsx` | Bundle | `react-phone-number-input` + `libphonenumber-js` + `country-flag-icons` (~350KB) | Lazy load apenas na página de cadastro |
| 5 | `componentes/Header.tsx` | CPU | Scroll listener em cada scroll | Usar Intersection Observer ou throttle |
| 6 | `@fortawesome/*` | Bundle | Múltiplos pacotes FontAwesome (~100KB+) | ✅ Já otimizado (self-hosted) |
| 7 | `componentes/AnimatedEye.tsx` | CPU | requestAnimationFrame contínuo | Considerar CSS animations |
| 8 | `public/tfjs-wasm/*.wasm` | Bundle | 3 arquivos WASM (~5MB total) | ✅ Já otimizado (cache agressivo) |
| 9 | `componentes/AnaliseTempoReal/*` | Bundle | 6 componentes grandes | ✅ Já lazy loaded na página |
| 10 | `next-pwa` | Bundle | Workbox e Service Worker | ✅ Apenas em produção |

**Prioridade de Otimização:**
1. Comets.tsx (CPU)
2. PhoneInput (Bundle - lazy load)
3. Header scroll listener (CPU)

---

## 6. Renomeação PT-BR (Sugestões Seguras)

### Pastas que PODEM ser renomeadas (fora de `app/`)

| ANTES | DEPOIS | Justificativa |
|-------|--------|---------------|
| ~~`components/`~~ | ✅ `componentes/` | Pasta interna, não afeta URLs |
| ~~`lib/`~~ | ✅ `biblioteca/` | Pasta interna, não afeta URLs |
| ~~`types/`~~ | ✅ `tipos/` | Pasta interna, não afeta URLs |
| ~~`IMAGENS/`~~ | ✅ `imagens/` | Pasta de assets, não afeta URLs |

### Pastas que NÃO devem ser renomeadas

| Pasta | Motivo |
|-------|--------|
| `app/` | Contém rotas (afeta URLs) |
| `app/login/` | Rota pública (`/login`) |
| `app/cadastro/` | Rota pública (`/cadastro`) |
| `app/analise-tempo-real/` | Rota pública (`/analise-tempo-real`) |
| `public/` | Padrão Next.js, não alterar |
| `.vscode/` | Configuração do editor |

### Padrão de Nomes Proposto

- **Pastas:** kebab-case, sem acentos
  - ✅ `componentes/` (não `Componentes/` ou `componentação/`)
  - ✅ `biblioteca/` (não `Biblioteca/` ou `bibliotéca/`)
  - ✅ `tipos/` (não `Tipos/` ou `tipôs/`)

- **Arquivos de código:** 
  - Componentes: PascalCase (`Header.tsx`, `LoginForm.tsx`)
  - Utilitários: camelCase (`validation.ts`, `config.ts`)

- **Documentação:** Pode ter acentos no conteúdo, mas não no nome do arquivo

### Exemplo de Renomeação Segura

```bash
# Fase 1: Renomear pastas internas (seguro) - ✅ CONCLUÍDO
components/ → componentes/ ✅
lib/ → biblioteca/ ✅
types/ → tipos/ ✅
IMAGENS/ → imagens/ ✅

# Atualizar imports automaticamente via editor
# Testar: npm run build && npm run dev
```

---

## 7. Checklist Final (Ordem Recomendada)

### Prioridade ALTA (Fazer Primeiro)

- [ ] **Otimizar Comets.tsx**
  - [ ] Adicionar throttle no requestAnimationFrame
  - [ ] Desabilitar em mobile (verificar `window.innerWidth`)
  - [ ] Considerar CSS animations como alternativa

- [ ] **Lazy Load PhoneInput**
  - [ ] Mover import para dentro do componente RegisterForm
  - [ ] Usar `dynamic()` do Next.js
  - [ ] Testar redução de bundle inicial

- [ ] **Otimizar Header scroll listener**
  - [ ] Implementar throttle (max 1x por 100ms)
  - [ ] Ou usar Intersection Observer
  - [ ] Testar performance

### Prioridade MÉDIA

- [ ] **Revisar imports de TensorFlow.js**
  - [ ] Verificar se tree-shaking está funcionando
  - [ ] Confirmar que apenas `tfjs-core` é usado
  - [ ] Analisar bundle size com `npm run analyze`

- [ ] **Otimizar FontAwesome**
  - [ ] Verificar se apenas ícones usados estão sendo importados
  - [ ] Considerar tree-shaking mais agressivo
  - [ ] Verificar se self-hosting está otimizado

- [ ] **Revisar lazy loading**
  - [ ] Confirmar que todos os componentes abaixo da dobra estão lazy loaded
  - [ ] Verificar loading states (altura mínima)
  - [ ] Testar CLS (Cumulative Layout Shift)

### Prioridade BAIXA (Polimento)

- [ ] **Renomear pastas para PT-BR**
  - [ ] Seguir plano em `docs/PLANO_RENOMEACAO_PTBR.md`
  - [ ] Fase 1: Pastas internas apenas
  - [ ] Testar após cada renomeação

- [ ] **Documentação de componentes**
  - [ ] Adicionar JSDoc em componentes públicos
  - [ ] Documentar props e exemplos de uso
  - [ ] Atualizar README

- [ ] **Testes de performance**
  - [ ] Rodar Lighthouse (FCP, LCP, TTI, CLS)
  - [ ] Verificar bundle size (< 500KB gzipped)
  - [ ] Testar em dispositivos móveis

### Verificações Finais

- [ ] **Build de produção**
  ```bash
  npm run build
  npm run start
  ```

- [ ] **Lint**
  ```bash
  npm run lint
  ```

- [ ] **TypeScript**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Bundle analysis**
  ```bash
  ANALYZE=true npm run build
  ```

---

## Resumo Executivo

### Estatísticas

- **Total de rotas:** 4 (/, /login, /cadastro, /analise-tempo-real)
- **Total de componentes:** ~25 componentes React
- **Client Components:** 7 arquivos (todos justificados)
- **Lazy loaded:** 8 componentes (Features, Stats, Footer, etc.)
- **Imports pesados:** 6 identificados (TensorFlow.js, FontAwesome, etc.)

### Status Geral

- ✅ **Estrutura:** Bem organizada, seguindo padrões Next.js
- ✅ **Performance:** Boa (lazy loading implementado)
- 🟡 **Otimizações:** Algumas oportunidades identificadas
- ✅ **Código:** Limpo, bem comentado, TypeScript

### Próximos Passos Recomendados

1. Otimizar Comets.tsx (CPU)
2. Lazy load PhoneInput (Bundle)
3. Otimizar Header scroll (CPU)
4. Renomear pastas para PT-BR (Fase 1)

---

**Última atualização:** 2025-01-27  
**Versão:** 1.0  
**Baseado em:** Código real de `apps/painel-web/`
