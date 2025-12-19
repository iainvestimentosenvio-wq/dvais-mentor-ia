---
name: Auditoria tecnica front-end
overview: Auditoria técnica do que já existe no repositório (principalmente `apps/painel-web`) com foco equilibrado em performance, segurança, boas práticas e qualidade de texto, mantendo a estética atual. O plano prioriza correções P0/P1 e otimizações de navegação/bundle sem mudanças visuais.
todos:
  - id: p0-remove-sensitive-logs
    content: Mapear e remover logs com dados sensíveis (login/cadastro) e reduzir logs de debug em produção (IA, ícones)
    status: pending
  - id: p0-fix-duplicated-fixedlogo
    content: Padronizar renderização do `FixedLogo` para evitar duplicação em páginas (layout vs pages) sem mudar layout visual
    status: pending
    dependencies:
      - p0-remove-sensitive-logs
  - id: p1-stop-auto-tfjs-init
    content: Evitar inicialização automática do TFJS/WASM no Hero; inicializar sob demanda/idle mantendo o mesmo visual
    status: pending
    dependencies:
      - p0-remove-sensitive-logs
  - id: p1-use-next-link
    content: Trocar navegação interna baseada em `<a href>` por `next/link` (sem mudar aparência) para transições rápidas/prefetch
    status: pending
    dependencies:
      - p0-fix-duplicated-fixedlogo
  - id: p1-scope-preview-css
    content: Separar regras de CSS de “preview do Cursor” das regras de produção (sem mudar estética), reduzindo risco de overflow/scrollbars indesejados
    status: pending
  - id: p2-copy-review
    content: Revisar texto/copy para tom profissional e responsável (remover promessas fortes, números de acurácia, ajustar claims de criptografia) mantendo o design
    status: pending
  - id: p2-csp-hardening
    content: Revisar CSP/headers para reduzir superfície de XSS (minimizar unsafe-inline/unsafe-eval quando possível) sem quebrar recaptcha/TFJS
    status: pending
  - id: p3-measure-and-compare
    content: Re-medida (Lighthouse/Web Vitals) e comparação de ganhos após as mudanças, com checklist de regressão
    status: pending
    dependencies:
      - p1-stop-auto-tfjs-init
      - p1-use-next-link
      - p1-scope-preview-css
      - p2-copy-review
      - p2-csp-hardening
---

# Auditoria técnica (sem alterar estética)

## Escopo analisado (o que existe hoje)

- **App principal**: [`apps/painel-web/`](apps/painel-web/) (Next.js 14 App Router)
- **Páginas atuais**: Home (`/`), Login (`/login`), Cadastro (`/cadastro`), Análise em Tempo Real (`/analise-tempo-real`), Segurança (`/seguranca`), Redirect (`/protecao-inteligente`).
- **Infra já presente**: headers de segurança, PWA em produção, WebAssembly/TensorFlow (WASM + SIMD), Tailwind, FontAwesome.

## Principais achados (alto impacto, sem mudar aparência)

### P0 — Segurança/privacidade (corrigir antes de qualquer produção)

- **Logs com dados sensíveis**: `console.log('Login:', formData)` e `console.log('Registro:', validation.data)` nos formulários.
- **Risco**: expõe email/senha no console do usuário (e em ferramentas de logging do navegador).
- **Arquivos**: [`apps/painel-web/componentes/auth/LoginForm.tsx`](apps/painel-web/componentes/auth/LoginForm.tsx), [`apps/painel-web/componentes/auth/RegisterForm.tsx`](apps/painel-web/componentes/auth/RegisterForm.tsx).
- **Logs excessivos na camada de IA**: vários `console.log/warn/error` em `biblioteca/ai/*`.
- **Risco**: polui logs e pode vazar detalhes de runtime/ambiente.
- **Arquivos**: [`apps/painel-web/biblioteca/ai/useAI.ts`](apps/painel-web/biblioteca/ai/useAI.ts), [`apps/painel-web/biblioteca/ai/config.ts`](apps/painel-web/biblioteca/ai/config.ts), [`apps/painel-web/biblioteca/ai/modelos.ts`](apps/painel-web/biblioteca/ai/modelos.ts).

### P0 — Bug visual/UX (provável duplicação de logo)

- **`FixedLogo` renderizado no `RootLayout` e também em páginas**.
- **Efeito**: alto risco de aparecer **logo duplicado** (ou comportamento estranho de z-index/click).
- **Arquivos**: [`apps/painel-web/app/layout.tsx`](apps/painel-web/app/layout.tsx) + páginas que também usam `<FixedLogo />` (ex.: `app/seguranca/page.tsx`, `app/login/page.tsx`, `app/cadastro/page.tsx`, `app/analise-tempo-real/page.tsx`).

### P1 — Performance (LCP/INP e navegação rápida)

- **Home inicializa IA no Hero**: `Hero.tsx` (client) monta `AIProcessor` com `autoInitialize=true` por default.
- **Efeito**: tende a puxar TFJS/WASM cedo (mesmo que esteja “só mostrando status”), aumentando JS inicial e potencialmente **piorando LCP/INP**.
- **Arquivos**: [`apps/painel-web/componentes/Hero.tsx`](apps/painel-web/componentes/Hero.tsx), [`apps/painel-web/componentes/AIProcessor.tsx`](apps/painel-web/componentes/AIProcessor.tsx), [`apps/painel-web/biblioteca/ai/config.ts`](apps/painel-web/biblioteca/ai/config.ts).
- **Navegação interna via `<a href="/…">`** em partes relevantes (ex.: cards de Features e CTAs no Hero).
- **Efeito**: faz **page reload** (mais lento) em vez de transição via App Router.
- **Exemplo**: [`apps/painel-web/componentes/Features.tsx`](apps/painel-web/componentes/Features.tsx) usa `<a href={feature.link}>`.

### P1 — CSS global com comportamento “agressivo”

- `globals.css` força `html { overflow-x: scroll !important; overflow-y: scroll !important; }` e outras regras específicas para “preview do Cursor”.
- **Efeito**: risco de UX inesperada em produção (scrollbars sempre visíveis), possível impacto em layout e render.
- **Arquivo**: [`apps/painel-web/app/globals.css`](apps/painel-web/app/globals.css).

### P1 — Qualidade do texto/copy (tom mais profissional e menos promessas)

- Há frases com **promessa forte / números de “acurácia”** que podem soar pouco profissionais ou arriscadas.
- Exemplo: “**Previsão com 70-85% de acurácia**” e “decisões lucrativas / do zero ao lucro”.
- **Arquivos**: [`apps/painel-web/componentes/AnaliseTempoReal/DadosExclusivos.tsx`](apps/painel-web/componentes/AnaliseTempoReal/DadosExclusivos.tsx), [`apps/painel-web/app/analise-tempo-real/page.tsx`](apps/painel-web/app/analise-tempo-real/page.tsx).
- Mensagens como “**criptografia de ponta**” sem especificar o que significa podem ser ajustadas para algo verificável (ex.: HTTPS/TLS).
- **Arquivos**: [`apps/painel-web/app/login/page.tsx`](apps/painel-web/app/login/page.tsx), [`apps/painel-web/app/cadastro/page.tsx`](apps/painel-web/app/cadastro/page.tsx).

### P2 — Segurança (headers/CSP)

- CSP atual permite `'unsafe-inline'` e `'unsafe-eval'` em `script-src`.
- **Risco**: abre superfície para XSS (injeção de script). Às vezes é necessário por ferramentas/libs, mas idealmente restringir.
- **Arquivo**: [`apps/painel-web/security-headers.config.js`](apps/painel-web/security-headers.config.js).

## Estimativa de ganhos (sem mudar estética)

> Valores são estimativas típicas; para números exatos, o plano inclui re-medição (Lighthouse/Web Vitals) quando você liberar execução.

- **Remover logs de senha/dados**: ganho de performance **pequeno**, mas ganho de **segurança crítico** (reduz risco de vazamento para ~0 nesse vetor).
- **Parar a inicialização automática do TFJS na Home** (manter o indicador, mas inicializar só quando necessário):
- **Ganho provável**: **redução grande do JS inicial** e melhoria de **LCP/INP**.
- **Estimativa**: 0.2–1.0s de melhora perceptível em dispositivos medianos + menos travadas na primeira interação.
- **Trocar `<a href>` por `next/link` (interno)**:
- **Ganho provável**: navegação “instantânea” (sem reload), prefetch e menos trabalho do browser.
- **Estimativa**: 300–1500ms a menos por navegação, sensação de app “rápido” aumenta muito.
- **Resolver duplicação do `FixedLogo`**:
- **Ganho provável**: elimina bug visual e reduz ruído de DOM.
- **Estimativa**: pequeno em performance, grande em qualidade.
- **Gating do CSS de “preview do Cursor”**:
- **Ganho provável**: reduz risco de comportamento estranho e melhora consistência cross-browser.
- **Estimativa**: pequeno em performance, médio em UX.
- **Ajustar copy para remover promessas fortes**:
- **Ganho provável**: melhora credibilidade e reduz risco jurídico/compliance.

## Glossário (termos técnicos em português simples)

- **LCP (Largest Contentful Paint)**: tempo até o maior elemento visível (normalmente o “hero”) aparecer. Menor é melhor.
- **INP (Interaction to Next Paint)**: mede a rapidez de resposta ao clique/toque. Menor é melhor (menos “travadas”).
- **CLS (Cumulative Layout Shift)**: mede se a página “pula” enquanto carrega. Menor é melhor.
- **FCP (First Contentful Paint)**: primeira vez que algo útil aparece na tela.
- **Bundle (pacote JS/CSS)**: arquivos que o navegador baixa para rodar o app.
- **Code splitting**: dividir o bundle em partes para baixar só o necessário.
- **Lazy loading**: carregar algo só quando precisar (ex.: ao rolar ou clicar).
- **Tree-shaking**: remover código não usado na build.
- **Server Component**: componente renderizado no servidor, envia menos JavaScript ao cliente.
- **Client Component**: componente que roda no navegador (tem estado/hooks), aumenta JS e custo de “hidratação”.
- **Hidratação (hydration)**: quando o React “liga” o HTML pronto com interatividade no navegador.
- **CSP (Content Security Policy)**: regra que diz de onde scripts/estilos podem carregar; ajuda a bloquear XSS.
- **HSTS**: força o navegador a usar HTTPS.
- **XSS**: ataque onde alguém injeta JavaScript malicioso.
- **Clickjacking**: site malicioso embute sua página em iframe para enganar clique.
- **PWA / Service Worker**: cache offline/instalável; acelera repetição, mas precisa ser bem configurado.
- **WASM (WebAssembly)**: formato rápido para rodar código pesado no browser.
- **SIMD**: recurso que acelera cálculos em paralelo.

## Plano de ação (quando você liberar execução)

### P0 — Segurança e bugs óbvios

- Remover logs com credenciais/dados nos formulários.
- Colocar logs de IA e `Icon` warnings atrás de `NODE_ENV !== 'production'`.
- Garantir que `FixedLogo` exista em **um único lugar** (layout ou páginas), sem duplicar.

### P1 — Performance sem mudança visual

- Parar de inicializar TFJS automaticamente na Home (inicializar sob demanda/idle/interação), mantendo o mesmo visual do indicador.
- Substituir navegação interna via `<a href>` por `next/link` (mesma aparência, melhor navegação).
- Revisar `globals.css` para separar regras “preview” de regras “produção” (sem alterar estética padrão).

### P2 — Texto/copy profissional e consistente

- Revisar frases que prometem resultado (ex.: “do zero ao lucro”, “70–85% de acurácia”) para versões mais responsáveis e verificáveis.
- Uniformizar disclaimers de “não é consultoria / sem promessas / decisão do usuário”.

### P2 — Hardening de headers

- Revisar CSP para reduzir `'unsafe-inline'/'unsafe-eval'` (quando possível) e/ou usar alternativas modernas (`nonce`, `'wasm-unsafe-eval'`), garantindo compatibilidade com TFJS/Recaptcha.

### P3 — Medição e regressão

- Regerar relatórios Lighthouse/medir Web Vitals e comparar “antes/depois”.
- Validar navegação (sem reload), responsividade e acessibilidade.