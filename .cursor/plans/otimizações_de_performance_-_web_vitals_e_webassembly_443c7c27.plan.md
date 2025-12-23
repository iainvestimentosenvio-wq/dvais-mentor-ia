---
name: Otimizações de Performance - Web Vitals e WebAssembly
overview: Plano seguro para ativar Web Vitals, implementar WebAssembly nos Comets e otimizar código existente sem alterar aparência visual ou funcionalidade.
todos: []
---

# Otimizações de Performance - Web Vitals e WebAssembly

## Princípios de Segurança

1. **Zero regressão visual** - Nenhuma mudança na aparência
2. **Zero quebra de funcionalidade** - Tudo continua funcionando igual
3. **Testes após cada etapa** - Verificar build e funcionamento
4. **Commits incrementais** - Fácil reverter se necessário
5. **Fallback seguro** - Se WASM falhar, usar JavaScript
6. **Baseline antes de mudar** - Medir performance atual antes de otimizar
7. **Validação de necessidade** - Verificar se otimização realmente é necessária

## Baseline de Performance (ANTES DE COMEÇAR)

### 0.1 Medir Performance Atual

- Executar Lighthouse CI: `npm run audit:lhci`
- Registrar métricas atuais:
- Performance Score
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
- Verificar FPS dos Comets (usar DevTools Performance)
- Registrar bundle size atual: `npm run analyze`
- **Salvar resultados em arquivo** para comparação depois

### 0.2 Verificar Necessidade de Otimizações

- Se Performance Score > 90: Otimizações podem ser desnecessárias
- Se Comets rodam a 60fps: WASM pode não ser necessário
- Documentar baseline para comparar depois

## Fase 1: Ativar Web Vitals (SEGURO)

### 1.1 Instalar web-vitals

- Executar: `npm install web-vitals` em `apps/painel-web`
- Verificar: `package.json` atualizado com versão compatível
- Verificar: `package-lock.json` atualizado

### 1.2 Melhorar WebVitals.tsx

- **Corrigir caminho**: Arquivo está em `performance/WebVitals.tsx` (não `app/components/`)
- **Adicionar tipos TypeScript**: Importar tipos de `web-vitals`
- **Melhorar implementação**:
- Em desenvolvimento: Log no console com cores/formatação
- Em produção: Opção de enviar para analytics (configurável)
- Tratamento de erros robusto
- Não bloquear renderização (lazy load)
- **Adicionar configuração**:
- Variável de ambiente para habilitar/desabilitar
- Opção de enviar para endpoint customizado (futuro)

### 1.3 Integrar no layout.tsx

- **Corrigir import**: Mudar de `./components/WebVitals` para `@/performance/WebVitals`
- Adicionar componente no layout (após children, antes de fechar body)
- Verificar que não quebra renderização SSR
- Adicionar verificação de `typeof window !== 'undefined'` se necessário

### 1.4 Testar

- Build funciona: `npm run build`
- Dev server funciona: `npm run dev`
- Métricas aparecem no console (desenvolvimento)
- Verificar que não adiciona bundle size significativo
- Verificar que não afeta LCP/FCP

## Fase 2: Otimizar Comets (PRIMEIRO: JavaScript, DEPOIS: WASM se necessário)

### 2.1 Medir Performance Atual dos Comets

- Usar DevTools Performance para medir FPS atual
- Verificar se está rodando a 60fps constante
- Medir uso de CPU durante animação
- **Decisão**: Se já roda a 60fps, pular para Fase 2.3 (otimizações JS leves)

### 2.2 Otimizar JavaScript dos Comets (ANTES de tentar WASM)

- **Cache de valores calculados**: Evitar recalcular distâncias desnecessariamente
- **Batch updates**: Atualizar todos os cometas em um único frame
- **Reduzir cálculos**: Usar aproximações quando possível (ex: distância ao quadrado em vez de sqrt)
- **Otimizar loops**: Usar `for` em vez de `forEach` (mais rápido)
- **Reutilizar variáveis**: Já feito, verificar se pode melhorar
- **Usar Web Workers** (opcional): Mover cálculos para worker thread
- **Testar**: Verificar se FPS melhorou após otimizações JS

### 2.3 Validar Necessidade de WASM

- **Se após otimizações JS ainda há lag**: Considerar WASM
- **Se roda a 60fps após otimizações JS**: NÃO implementar WASM (complexidade desnecessária)
- **Decisão do usuário**: Apresentar métricas antes/depois e pedir aprovação

### 2.4 Implementar WASM (APENAS SE NECESSÁRIO E APROVADO)

- **Requisitos prévios**:
- Instalar Rust toolchain OU AssemblyScript
- Configurar build system (wasm-pack ou AssemblyScript compiler)
- Adicionar script de build ao `package.json`
- **Criar módulo WASM**:
- `performance/comets.wasm` (compilar)
- `performance/comets.ts` (loader TypeScript com tipos)
- Funções WASM:
- `update_comet_position(x, y, mouseX, mouseY, speed) -> (newX, newY)`
- `calculate_distance_squared(x1, y1, x2, y2) -> distance_squared` (evitar sqrt)
- `batch_update_comets(comets_array) -> updated_array`
- **Integrar no Comets.tsx**:
- Carregar WASM assincronamente (não bloquear renderização)
- Fallback automático para JavaScript se WASM falhar
- Manter mesma lógica visual (mesmos cálculos, apenas mais rápido)
- Adicionar ao `.gitignore` se compilar localmente: `*.wasm` (exceto os já versionados)

### 2.5 Testar WASM (se implementado)

- Animação funciona igual visualmente
- Performance melhorada (FPS constante a 60fps)
- Fallback funciona se WASM não carregar
- Testar em múltiplos navegadores (Chrome, Firefox, Safari, Edge)
- Verificar que não quebra em navegadores sem suporte a WASM

## Fase 3: Otimizações de Código (SEGURO)

### 3.1 Análise de Componentes Específicos

**Componentes a verificar** (identificados com hooks):

- `apps/painel-web/componentes/auth/LoginForm.tsx`
- `apps/painel-web/componentes/auth/RegisterForm.tsx`
- `apps/painel-web/componentes/auth/PhoneInput.tsx`
- `apps/painel-web/componentes/Header.tsx`
- `apps/painel-web/componentes/Comets.tsx` (já otimizado na Fase 2)
- `apps/painel-web/componentes/AIProcessor.tsx`

**Para cada componente**:

1. Verificar se `useCallback`/`useMemo` são necessários (não adicionar desnecessariamente)
2. Verificar dependências de `useEffect` (evitar loops infinitos)
3. Verificar re-renderizações desnecessárias (usar React DevTools Profiler)

### 3.2 Otimizar hooks React (Critérios Claros)

**Quando usar `useCallback`**:

- Função passada como prop para componente memoizado
- Função usada como dependência de `useEffect`/`useMemo`
- Função criada dentro de loop/condicional

**Quando usar `useMemo`**:

- Cálculo custoso (não para valores simples)
- Valor usado como dependência de `useEffect`/`useMemo`
- Valor passado como prop para componente memoizado

**Quando NÃO usar**:

- Valores primitivos simples
- Objetos/arrays que mudam sempre (não há ganho)
- Funções simples que não são dependências

### 3.3 Simplificar lógica complexa

- Extrair funções puras (facilitar testes e reuso)
- Reduzir complexidade ciclomática (máximo 10 por função)
- Remover código duplicado (DRY principle)
- Simplificar condicionais aninhadas

### 3.4 Otimizar imports

- Verificar imports não utilizados (usar ESLint)
- Usar dynamic imports onde apropriado:
- Componentes pesados (ex: gráficos, editores)
- Bibliotecas grandes carregadas sob demanda
- Verificar tree-shaking funcionando (`npm run analyze`)

### 3.5 Otimizar validações (auth)

- Verificar se validações podem ser otimizadas
- Cache de resultados de validação quando possível
- Evitar re-validações desnecessárias

### 3.6 Testar

- Build funciona: `npm run build`
- Lint passa: `npm run lint`
- Nenhuma funcionalidade quebrada
- Performance igual ou melhor (comparar com baseline)
- Bundle size não aumentou (verificar com `npm run analyze`)

## Fase 4: Verificação Final e Comparação

### 4.1 Testes completos

- Build de produção: `npm run build` (sem erros)
- Dev server: `npm run dev` (funciona corretamente)
- Todas as páginas carregam:
- `/` (Home)
- `/login`
- `/cadastro`
- `/analise-tempo-real`
- `/seguranca`
- `/aprendizado-continuo`
- Animações funcionam (Comets, hover effects)
- Web Vitals registrando métricas (console ou analytics)

### 4.2 Comparar Métricas (Antes vs Depois)

- **Lighthouse CI**: `npm run audit:lhci`
- Performance Score melhorou?
- LCP melhorou?
- FID melhorou?
- CLS melhorou?
- **Web Vitals**: Comparar métricas no console
- **Bundle Size**: `npm run analyze`
- Tamanho total melhorou ou manteve?
- Chunks otimizados?
- **FPS dos Comets**: Medir novamente com DevTools
- Melhorou após otimizações?
- Roda a 60fps constante?

### 4.3 Documentar Resultados

- Criar arquivo `performance/OTIMIZACOES_RESULTADOS.md`
- Registrar métricas antes/depois
- Documentar melhorias obtidas
- Listar otimizações aplicadas

## Arquivos a Modificar

### Fase 0: Baseline

- Criar: `performance/BASELINE_METRICAS.md` - Registrar métricas iniciais

### Fase 1: Web Vitals

- `apps/painel-web/package.json` - Adicionar `web-vitals` nas dependencies
- `apps/painel-web/performance/WebVitals.tsx` - Melhorar implementação completa
- `apps/painel-web/app/layout.tsx` - Corrigir import (de `./components/WebVitals` para `@/performance/WebVitals`) e adicionar componente

### Fase 2: Otimizar Comets

- `apps/painel-web/componentes/Comets.tsx` - Otimizar JavaScript primeiro
- `apps/painel-web/performance/comets.wasm` - NOVO (apenas se necessário e aprovado)
- `apps/painel-web/performance/comets.ts` - NOVO (loader TypeScript, apenas se WASM implementado)
- `.gitignore` - Adicionar `*.wasm` se compilar localmente (exceto os já versionados)

### Fase 3: Otimizações de Código

- `apps/painel-web/componentes/auth/LoginForm.tsx` - Otimizar hooks
- `apps/painel-web/componentes/auth/RegisterForm.tsx` - Otimizar hooks
- `apps/painel-web/componentes/auth/PhoneInput.tsx` - Otimizar hooks
- `apps/painel-web/componentes/Header.tsx` - Otimizar hooks
- `apps/painel-web/componentes/AIProcessor.tsx` - Otimizar hooks
- Verificar outros componentes conforme necessário

### Fase 4: Documentação

- Criar: `performance/OTIMIZACOES_RESULTADOS.md` - Resultados finais

## Notas Importantes

### WebAssembly nos Comets

- **Complexidade**: Alta (precisa compilar WASM, configurar build system)
- **Benefício**: 3-10x mais rápido, mais fluido (se realmente necessário)
- **Risco**: Médio (pode quebrar build se mal configurado, mas tem fallback)
- **Recomendação**: SÓ implementar se otimizações JavaScript não forem suficientes
- **Alternativa preferida**: Otimizar JavaScript primeiro (Fase 2.2)

### Web Vitals

- **Complexidade**: Baixa (instalar e melhorar implementação)
- **Benefício**: Monitoramento de performance em tempo real
- **Risco**: Zero (não afeta funcionalidade, apenas monitora)
- **Importante**: Corrigir caminho do import no layout.tsx

### Otimizações de Código

- **Complexidade**: Baixa-Média (análise cuidadosa componente por componente)
- **Benefício**: Código mais limpo, melhor performance, menos re-renderizações
- **Risco**: Baixo (mudanças incrementais, fácil reverter)
- **Importante**: Não adicionar `useCallback`/`useMemo` desnecessariamente (pode piorar performance)

## Ordem de Execução (CORRIGIDA)

1. **Fase 0** (Baseline) - Medir performance atual ANTES de mudar nada
2. **Fase 1** (Web Vitals) - Mais simples, risco zero, útil para monitorar
3. **Fase 3** (Otimizações de Código) - Melhorar código existente, baixo risco
4. **Fase 2** (Otimizar Comets) - JavaScript primeiro, WASM só se necessário
5. **Fase 4** (Verificação Final) - Comparar métricas e documentar resultados

## Plano de Rollback

### Se algo quebrar em qualquer fase:

**Fase 1 (Web Vitals)**:

- Reverter: `git revert` do commit da Fase 1
- Ou: Comentar código novamente e remover do layout.tsx

**Fase 3 (Otimizações)**:

- Reverter: `git revert` do commit da Fase 3
- Ou: Reverter mudanças específicas por componente

**Fase 2 (Comets)**:

- Se otimizações JS quebrarem: Reverter mudanças em `Comets.tsx`
- Se WASM quebrar: Remover arquivos WASM e manter fallback JS
- Reverter: `git revert` do commit da Fase 2

### Commits Incrementais

- **Fase 0**: `git commit -m "feat: baseline de performance"`
- **Fase 1**: `git commit -m "feat: ativar Web Vitals"`
- **Fase 3**: `git commit -m "refactor: otimizar hooks React"`
- **Fase 2.2**: `git commit -m "perf: otimizar JavaScript dos Comets"`
- **Fase 2.4** (se aplicável): `git commit -m "perf: implementar WASM nos Comets"`
- **Fase 4**: `git commit -m "docs: documentar resultados de otimizações"`

## Validação de Necessidade

### Antes de implementar WASM nos Comets:

1. ✅ Medir FPS atual (baseline)
2. ✅ Otimizar JavaScript primeiro
3. ✅ Medir FPS após otimizações JS
4. ✅ Se ainda há lag (< 60fps): Considerar WASM
5. ✅ Se roda a 60fps: NÃO implementar WASM (complexidade desnecessária)
6. ✅ Apresentar métricas ao usuário para aprovação

### Critérios para NÃO implementar WASM:

- Comets já rodam a 60fps constante
- Otimizações JS foram suficientes
- Bundle size aumentaria significativamente
- Complexidade de manutenção não justifica ganho

## Checklist de Segurança

### Antes de cada fase:

- [ ] Fazer commit do estado atual
- [ ] Verificar que build funciona
- [ ] Verificar que dev server funciona
- [ ] Testar páginas principais

### Durante cada fase:

- [ ] Fazer mudanças incrementais (não tudo de uma vez)
- [ ] Testar após cada mudança significativa
- [ ] Verificar que aparência visual não mudou
- [ ] Verificar que funcionalidade não quebrou

### Após cada fase:

- [ ] Build funciona: `npm run build`
- [ ] Dev server funciona: `npm run dev`
- [ ] Lint passa: `npm run lint`
- [ ] Todas as páginas carregam
- [ ] Animações funcionam
- [ ] Fazer commit incremental
- [ ] Comparar métricas (se aplicável)

## Riscos e Mitigações

### Risco: WASM quebra build

**Mitigação**:

- Implementar apenas se otimizações JS não forem suficientes
- Fallback automático para JavaScript
- Testar em múltiplos navegadores
- Commits incrementais (fácil reverter)

### Risco: useCallback/useMemo desnecessários pioram performance

**Mitigação**:

- Critérios claros de quando usar (documentados na Fase 3)
- Medir antes/depois com React DevTools Profiler
- Não adicionar "por precaução"

### Risco: Web Vitals adiciona bundle size

**Mitigação**:

- `web-vitals` é pequeno (~2KB gzipped)
- Lazy load do componente
- Verificar bundle size com `npm run analyze`

### Risco: Otimizações quebram funcionalidade

**Mitigação**:

- Mudanças incrementais