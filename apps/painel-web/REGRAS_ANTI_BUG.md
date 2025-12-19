# 🛡️ Regras Anti-Bug - Programação Inquebrável

## 🚨 REGRA FUNDAMENTAL: NUNCA USE `memo()` EM COMPONENTES

**PROBLEMA IDENTIFICADO**: O uso de `memo()` está causando erros `<nextjs-portal>` recorrentes.

**SOLUÇÃO DEFINITIVA**: **NUNCA** use `memo()` em nenhum componente, a menos que seja absolutamente necessário e testado.

---

## ✅ PADRÃO CORRETO DE EXPORTS

### Server Components (padrão)
```typescript
// ✅ CORRETO - Export direto
export default function Component() {
  return <div>...</div>
}
```

### Client Components
```typescript
// ✅ CORRETO - Export direto
'use client'

export default function Component() {
  const [state, setState] = useState()
  return <div>...</div>
}
```

### ❌ NUNCA FAÇA ISSO
```typescript
// ❌ ERRADO - memo() causa bugs
import { memo } from 'react'
export default memo(Component)

// ❌ ERRADO - Export separado
function Component() { ... }
export default Component
```

---

## 🔒 REGRAS OBRIGATÓRIAS

### 1. Exports Padronizados
- ✅ **SEMPRE** use `export default function ComponentName()`
- ❌ **NUNCA** use `memo()` ou outros HOCs
- ❌ **NUNCA** separe a declaração do export

### 2. Server vs Client Components
- ✅ **Server Components** por padrão (sem 'use client')
- ✅ **Client Components** apenas quando necessário (hooks, eventos)
- ❌ **NUNCA** use 'use client' desnecessariamente

### 3. Imports
- ✅ **SEMPRE** use imports diretos para Server Components
- ⚠️ **Dynamic imports** apenas para Client Components pesados (3D, vídeo, etc.)
- ❌ **NUNCA** use `dynamic` para Server Components simples

### 4. Estrutura de Arquivos
- ✅ **SEMPRE** um componente por arquivo
- ✅ **SEMPRE** export default no mesmo arquivo
- ❌ **NUNCA** exporte múltiplos componentes do mesmo arquivo

---

## 🐛 PROBLEMAS CRÍTICOS ENFRENTADOS E SOLUÇÕES

### 🚨 PROBLEMA 1: Tela Preta (Recorrente)

**O QUE ACONTECEU**: A tela ficava completamente preta, sem mostrar nenhum conteúdo.

**CAUSA RAIZ**: 
- Elementos de fundo (`aurora-bg`, `light-beams`) com `position: absolute` cobriam o conteúdo
- O conteúdo não tinha `z-index` suficiente para ficar acima dos elementos de fundo
- Body sem `margin: 0, padding: 0` causava problemas de renderização

**SOLUÇÃO DEFINITIVA**:
```typescript
// ✅ CORRETO - Wrapper com z-index OBRIGATÓRIO
<body className="min-h-screen text-white chameleon-bg" style={{ margin: 0, padding: 0 }}>
  {/* Elementos de fundo */}
  <div className="aurora-bg"></div>
  <div className="light-beam-2"></div>
  {/* ... outros elementos de fundo ... */}
  
  {/* ⚠️ ESTE WRAPPER É OBRIGATÓRIO - NUNCA REMOVER */}
  <div style={{ position: 'relative', zIndex: 1 }}>
    {children}
  </div>
</body>
```

**REGRAS OBRIGATÓRIAS**:
- ✅ **SEMPRE** manter wrapper com `position: 'relative', zIndex: 1`
- ✅ **SEMPRE** manter `margin: 0, padding: 0` no body
- ❌ **NUNCA** remover o wrapper sem ajustar z-index
- ❌ **NUNCA** alterar z-index dos elementos de fundo sem ajustar o conteúdo

**CHECKLIST ANTES DE MUDANÇAS NO LAYOUT**:
- [ ] Wrapper com z-index está presente?
- [ ] Body tem `margin: 0, padding: 0`?
- [ ] Elementos de fundo têm z-index menor que o conteúdo?
- [ ] Conteúdo tem z-index maior que os elementos de fundo?
- [ ] Testado visualmente após mudanças?

---

### 🚨 PROBLEMA 2: Erro `<nextjs-portal>` (Recorrente)

**O QUE ACONTECEU**: Erro `<nextjs-portal>` aparecia no console e a página não carregava corretamente.

**CAUSA RAIZ**: 
- Uso de `memo()` em componentes causava conflitos com Next.js 14
- Uso de `dynamic` imports em Server Components simples causava problemas
- Exports incorretos (separados da declaração)

**SOLUÇÕES APLICADAS**:

1. **Remover `memo()` de todos os componentes**:
```typescript
// ❌ ERRADO - Causa erro <nextjs-portal>
import { memo } from 'react'
export default memo(Header)

// ✅ CORRETO - Export direto
export default function Header() {
  return <header>...</header>
}
```

2. **Não usar `dynamic` para Server Components simples**:
```typescript
// ❌ ERRADO - Causa erro com Server Components
import dynamic from 'next/dynamic'
const Features = dynamic(() => import('@/components/Features'))

// ✅ CORRETO - Import direto para Server Components
import Features from '@/components/Features'
```

3. **Usar `dynamic` apenas para Client Components pesados**:
```typescript
// ✅ CORRETO - Dynamic apenas para Client Components pesados
const Heavy3DComponent = dynamic(() => import('@/components/Heavy3D'), {
  loading: () => <div>Carregando...</div>,
  ssr: false, // Apenas para componentes que não precisam de SSR
})
```

**REGRAS OBRIGATÓRIAS**:
- ✅ **SEMPRE** usar export direto: `export default function Component()`
- ❌ **NUNCA** usar `memo()` sem necessidade extrema
- ❌ **NUNCA** usar `dynamic` para Server Components simples
- ✅ **SEMPRE** usar imports diretos para Server Components

---

### 🚨 PROBLEMA 3: Página Não Abre / Comando Trava

**O QUE ACONTECEU**: Após algumas mudanças, a página não abria mais ou comandos travavam.

**CAUSA RAIZ**: 
- Cache corrompido do Next.js (`.next`)
- Processos Node.js antigos ainda rodando
- Mudanças estruturais sem limpar cache

**SOLUÇÃO**:
```bash
# 1. Parar todos os processos Node
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpar cache
Remove-Item -Recurse -Force .next

# 3. Reinstalar dependências (se necessário)
npm install

# 4. Rebuild
npm run build
```

**REGRAS OBRIGATÓRIAS**:
- ✅ **SEMPRE** limpar `.next` após mudanças estruturais
- ✅ **SEMPRE** parar processos antigos antes de iniciar novo servidor
- ✅ **SEMPRE** testar build após mudanças significativas

---

### 🚨 PROBLEMA 4: Rolagem Indefinida e Espaços Vazios

**O QUE ACONTECEU**: 
- Rolagem horizontal e vertical indefinida (aumenta ou diminui)
- Espaços vazios sem conteúdo embaixo e nas laterais
- Barra de rolagem muda de tamanho

**CAUSA RAIZ**: 
- Elementos de fundo com `width: 150%` e `height: 150%` causavam overflow
- `position: absolute` nos elementos de fundo criava scroll desnecessário
- Falta de controle sobre viewport (html/body)
- Elementos ultrapassando limites do viewport

**SOLUÇÃO DEFINITIVA**:
```css
/* ✅ CORRETO - HTML e Body controlados */
html {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden; /* SEM scroll horizontal */
  overflow-y: auto;
}

body {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden; /* SEM scroll horizontal */
  overflow-y: auto;
}

/* ✅ CORRETO - Elementos de fundo fixos */
.aurora-bg,
.light-beam-2,
.light-beam-3,
/* ... outros light-beams ... */ {
  position: fixed; /* Fixed não causa scroll */
  width: 100vw; /* Largura do viewport, não 150% */
  height: 100vh; /* Altura do viewport, não 150% */
  max-width: 100vw; /* Garante que não ultrapasse */
  max-height: 100vh; /* Garante que não ultrapasse */
  overflow: hidden; /* Previne overflow */
}
```

**REGRAS OBRIGATÓRIAS**:
- ✅ **SEMPRE** usar `overflow-x: hidden` no html e body
- ✅ **SEMPRE** usar `position: fixed` para elementos de fundo
- ✅ **SEMPRE** usar `100vw/100vh` para elementos de fundo (não 150%)
- ✅ **SEMPRE** usar `max-width: 100vw` em containers principais
- ❌ **NUNCA** usar `width: 150%` ou `height: 150%` em elementos de fundo
- ❌ **NUNCA** usar `position: absolute` em elementos que podem causar overflow

**CHECKLIST ANTES DE MUDANÇAS NO LAYOUT**:
- [ ] HTML tem `overflow-x: hidden`?
- [ ] Body tem `overflow-x: hidden`?
- [ ] Elementos de fundo usam `position: fixed`?
- [ ] Elementos de fundo usam `100vw/100vh` (não 150%)?
- [ ] Não há scroll horizontal (verificar visualmente)?
- [ ] Não há espaços vazios nas laterais ou embaixo?

**Ver detalhes completos**: [CORRECAO_ROLAGEM_INDEFINIDA.md](./CORRECAO_ROLAGEM_INDEFINIDA.md)

---

## ✅ CHECKLIST ANTES DE COMMIT

- [ ] Nenhum componente usa `memo()`
- [ ] Todos os exports são `export default function`
- [ ] Todos os componentes retornam JSX válido
- [ ] Nenhum `dynamic` import para Server Components simples
- [ ] Wrapper com z-index está presente no layout
- [ ] Body tem `margin: 0, padding: 0`
- [ ] HTML e Body têm `overflow-x: hidden`
- [ ] Elementos de fundo usam `position: fixed` e `100vw/100vh` (não 150%)
- [ ] Não há scroll horizontal (verificar visualmente)
- [ ] Não há espaços vazios nas laterais ou embaixo
- [ ] Build funciona sem erros
- [ ] Servidor inicia sem erros
- [ ] Página carrega sem tela preta
- [ ] Sem erros `<nextjs-portal>` no console

---

## 📋 TEMPLATE PADRÃO

### Server Component
```typescript
export default function ComponentName() {
  return (
    <div>
      {/* Conteúdo */}
    </div>
  )
}
```

### Client Component
```typescript
'use client'

export default function ComponentName() {
  const [state, setState] = useState()
  
  return (
    <div>
      {/* Conteúdo */}
    </div>
  )
}
```

---

## 🎯 RESUMO DAS LIÇÕES APRENDIDAS

1. **`memo()` é perigoso** - Evite a menos que absolutamente necessário
2. **Server Components não devem ser lazy loaded** - Use imports diretos
3. **Z-index é crítico** - Wrapper obrigatório no layout
4. **Cache precisa ser limpo** - Sempre limpar `.next` após mudanças estruturais
5. **Exports diretos** - Sempre `export default function`, nunca separado
6. **Overflow deve ser controlado** - `overflow-x: hidden` no html/body, elementos de fundo com `position: fixed` e `100vw/100vh`

---

**Última atualização**: 2025-01-27
**Status**: ✅ Regras Aplicadas e Testadas
