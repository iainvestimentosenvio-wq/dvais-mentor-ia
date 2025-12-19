# 📋 Guia de Boas Práticas - Painel Web Front-End

## 🎯 OBJETIVO

Este documento **DEVE SER LIDO ANTES** de qualquer alteração no código. Contém todas as regras e práticas que **DEVEM SER SEGUIDAS RIGOROSAMENTE** para garantir:

- ✅ Performance otimizada (< 1.8s FCP, < 2.5s LCP)
- ✅ Código limpo e manutenível
- ✅ Experiência do usuário superior
- ✅ Preparado para IA em tempo real (futuro)

---

## ⚠️ REGRA FUNDAMENTAL

**ANTES DE ESCREVER QUALQUER CÓDIGO:**
1. ✅ Ler este documento completamente
2. ✅ Verificar se a mudança segue todas as práticas
3. ✅ Consultar a seção relevante durante o desenvolvimento
4. ✅ Validar o código após implementação

---

## 📚 ÍNDICE

1. [Server vs Client Components](#1-server-vs-client-components)
2. [Otimização de Imagens](#2-otimização-de-imagens)
3. [Otimização de Fontes](#3-otimização-de-fontes)
4. [Code Splitting e Lazy Loading](#4-code-splitting-e-lazy-loading)
5. [Comentários no Código](#5-comentários-no-código)
6. [Análise de Funções Pesadas](#6-análise-de-funções-pesadas)
7. [Otimizações Futuras](#7-otimizações-futuras)
8. [Checklist de Validação](#8-checklist-de-validação)

---

## 1️⃣ SERVER VS CLIENT COMPONENTS

### ✅ REGRA: Server Component por padrão

**SEMPRE** comece com Server Component. Use `'use client'` **APENAS** quando necessário.

```typescript
// ✅ CORRETO - Server Component (padrão)
export default function Features() {
  return <div>...</div>
}

// ❌ ERRADO - Client Component desnecessário
'use client'
export default function Features() {
  return <div>...</div>
}

// ✅ CORRETO - Client Component quando necessário
'use client'
export default function InteractiveButton() {
  const [state, setState] = useState()
  return <button onClick={() => setState(!state)}>...</button>
}
```

**Quando usar `'use client'`:**
- ✅ Hooks do React (`useState`, `useEffect`, `useRef`, etc.)
- ✅ Event handlers (`onClick`, `onChange`, etc.)
- ✅ APIs do navegador (`window`, `document`, `localStorage`, etc.)
- ✅ Bibliotecas client-side (Three.js, TensorFlow.js, etc.)

**Quando NÃO usar `'use client'`:**
- ❌ Componentes estáticos
- ❌ Componentes que só renderizam JSX
- ❌ Componentes que só recebem props

**Benefício**: Reduz JavaScript inicial em ~40%

---

## 2️⃣ OTIMIZAÇÃO DE IMAGENS

### ✅ REGRA: SEMPRE usar `next/image`

**NUNCA** use `<img>`. **SEMPRE** use `next/image`.

```typescript
// ✅ CORRETO
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // true apenas acima da dobra
  quality={85}
  placeholder="blur"
  format="webp" // ou "avif"
/>

// ❌ ERRADO
<img src="/image.jpg" alt="Description" />
```

**Benefício**: Reduz tamanho de imagens em 50-70%

---

## 3️⃣ OTIMIZAÇÃO DE FONTES

### ✅ REGRA: SEMPRE usar `next/font`

**NUNCA** use `<link>` para fontes. **SEMPRE** use `next/font`.

```typescript
// ✅ CORRETO
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

// ❌ ERRADO
<link href="https://fonts.googleapis.com/css2?family=Inter" />
```

**Benefício**: Reduz tempo de carregamento de fontes em 80%

---

## 4️⃣ CODE SPLITTING E LAZY LOADING

### ✅ REGRA: Lazy loading para componentes pesados

**SEMPRE** use `dynamic` para componentes pesados (3D, vídeo, IA).

```typescript
// ✅ CORRETO
import dynamic from 'next/dynamic'

const Character3D = dynamic(() => import('@/components/Character3D'), {
  loading: () => <div className="min-h-[400px]" />, // Altura mínima previne layout shift
  ssr: false, // 3D não precisa de SSR
})

// ❌ ERRADO
import Character3D from '@/components/Character3D'
```

**Aplicar em:**
- ✅ Componentes 3D
- ✅ Players de vídeo
- ✅ Módulos de IA
- ✅ Bibliotecas pesadas
- ✅ Componentes não críticos para FCP

**Benefício**: Reduz bundle inicial em 40-60%

---

## 5️⃣ COMENTÁRIOS NO CÓDIGO

### ✅ REGRA: Comentários explicam POR QUÊ, não apenas O QUE

**SEMPRE** adicione JSDoc em componentes/funções públicas e explique decisões técnicas.

```typescript
/**
 * Componente de Features
 * 
 * Por quê lazy loading?
 * - Reduz bundle inicial em ~40% (melhora FCP)
 * - Carrega apenas quando usuário rola até a seção
 * - Melhora Time to Interactive (TTI)
 * 
 * @param {object} props - Props do componente
 * @returns {JSX.Element} Seção de features
 */
export default function Features(props) {
  // ...
}
```

**Template JSDoc:**
```typescript
/**
 * Nome do Componente/Função
 * 
 * Descrição do que faz
 * - Ponto 1
 * - Ponto 2
 * 
 * Por quê esta implementação?
 * - Decisão técnica 1
 * - Decisão técnica 2
 * 
 * Performance:
 * - Otimização 1
 * - Otimização 2
 * 
 * @param {Tipo} param - Descrição
 * @returns {Tipo} Descrição
 */
```

**Benefício**: Facilita manutenção e ajuda IA a entender o código

---

## 6️⃣ ANÁLISE DE FUNÇÕES PESADAS

### ✅ REGRA: Identificar funções pesadas para WebAssembly

**SEMPRE** analise funções que fazem processamento pesado. Se necessário, considere reescrever em Rust/C/C++ e compilar para WebAssembly.

**Quando considerar WebAssembly:**
- ✅ Processamento de imagens/vídeo pesado
- ✅ Cálculos matemáticos complexos
- ✅ Compressão/descompressão de dados
- ✅ Processamento de áudio em tempo real
- ✅ Algoritmos de IA/ML pesados
- ✅ Qualquer função que bloqueia a UI por > 100ms

**Processo de análise:**
1. Identificar função pesada (performance.now())
2. Medir tempo de execução
3. Se > 100ms, considerar WebAssembly
4. Reescrever em Rust (recomendado) ou C/C++
5. Compilar para .wasm
6. Integrar no front-end

**Exemplo:**
```typescript
// ❌ ANTES - JavaScript (lento)
function processImage(imageData) {
  // Processamento pesado bloqueia UI
  for (let i = 0; i < imageData.length; i++) {
    // ... processamento pesado
  }
}

// ✅ DEPOIS - WebAssembly (Rust)
// src/lib.rs
#[wasm_bindgen]
pub fn process_image(image_data: &[u8]) -> Vec<u8> {
  // Processamento rápido em Rust
}

// front-end
import init, { process_image } from './pkg/image_processor.js'
await init()
const result = process_image(imageData) // 10-100x mais rápido
```

**Benefício**: Performance 10-100x superior, economia de servidor

**⚠️ LEMBRAR**: Estamos apenas no front-end agora. WebAssembly será implementado quando necessário.

---

## 7️⃣ OTIMIZAÇÕES FUTURAS

### 📋 Checklist de Otimizações para IA em Tempo Real

**⚠️ IMPORTANTE**: Estas otimizações serão implementadas quando o backend estiver pronto. Por enquanto, apenas documentar e planejar.

#### Fase 1: Comunicação em Tempo Real (CRÍTICO)

**WebSocket para IA:**
- ✅ Latência: < 50ms (vs 200-500ms REST)
- ✅ Comunicação bidirecional instantânea
- ✅ Menos carga no servidor
- ✅ Throttling: Reduz tráfego em 90%

**Status**: ❌ Não implementado (aguardando backend)

---

#### Fase 2: Streaming de Vídeo (CRÍTICO)

**HLS.js para streaming adaptativo:**
- ✅ Qualidade adaptativa automática
- ✅ Sem travamentos
- ✅ Economiza 50-70% de banda
- ✅ Lazy loading: Reduz carga inicial em 80%

**Status**: ❌ Não implementado (aguardando backend)

---

#### Fase 3: Processamento de Áudio/Voz (CRÍTICO)

**Captura de áudio:**
- ✅ Processamento não trava UI
- ✅ Qualidade otimizada (16kHz)
- ✅ Economiza processamento

**Text-to-Speech:**
- ✅ Nativo do navegador (rápido)
- ✅ Sem dependências externas

**Status**: ❌ Não implementado (aguardando backend)

---

#### Fase 4: Renderização 3D - Avatar (CRÍTICO)

**React Three Fiber:**
- ✅ 60 FPS garantidos
- ✅ Qualidade adaptativa
- ✅ Renderização sob demanda

**LOD (Level of Detail):**
- ✅ Reduz polígonos em 80-90%
- ✅ Mantém 60 FPS
- ✅ Economiza GPU

**Status**: ❌ Não implementado (aguardando backend)

---

#### Fase 5: Screen Sharing (CRÍTICO)

**Captura de tela otimizada:**
- ✅ 10 FPS (suficiente para IA)
- ✅ Compressão JPEG (50-100KB vs 5MB)
- ✅ Não trava UI

**Status**: ❌ Não implementado (aguardando backend)

---

#### Fase 6: Web Workers (CRÍTICO)

**Processamento pesado:**
- ✅ UI nunca trava
- ✅ 60 FPS garantidos
- ✅ Processamento paralelo

**Status**: ❌ Não implementado (aguardando backend)

---

#### Fase 7: Otimização de Memória (CRÍTICO)

**Memory cleanup:**
- ✅ Sem vazamentos
- ✅ Limpeza automática
- ✅ Performance consistente

**Status**: ❌ Não implementado (aguardando backend)

---

### 📊 Resumo de Otimizações Futuras

| Funcionalidade | Status | Prioridade | Ganho |
|----------------|--------|------------|-------|
| WebSocket | ❌ | 🔴 CRÍTICO | Latência < 50ms |
| Throttling | ❌ | 🔴 CRÍTICO | -90% tráfego |
| HLS Streaming | ❌ | 🔴 CRÍTICO | Sem travamentos |
| Lazy Video | ❌ | 🟡 ALTA | -80% carga inicial |
| Audio Capture | ❌ | 🔴 CRÍTICO | Não trava UI |
| Text-to-Speech | ❌ | 🟡 ALTA | Nativo (rápido) |
| Avatar 3D | ❌ | 🔴 CRÍTICO | 60 FPS |
| LOD Avatar | ❌ | 🟡 ALTA | -80% polígonos |
| Screen Capture | ❌ | 🔴 CRÍTICO | -95% dados |
| Web Workers | ❌ | 🔴 CRÍTICO | UI nunca trava |
| Memory Cleanup | ❌ | 🔴 CRÍTICO | Sem vazamentos |

**⚠️ LEMBRAR**: Estamos apenas no front-end agora. Backend será implementado depois.

---

## 8️⃣ CHECKLIST DE VALIDAÇÃO

### Antes de cada commit, verificar:

#### Performance
- [ ] Bundle size analisado (< 500KB gzipped)?
- [ ] Lazy loading implementado em componentes pesados?
- [ ] Imagens otimizadas com `next/image`?
- [ ] Fontes otimizadas com `next/font`?

#### Código
- [ ] Server Components por padrão?
- [ ] Client Components apenas quando necessário?
- [ ] Comentários JSDoc em componentes públicos?
- [ ] Comentários explicam POR QUÊ?

#### Funcionalidade
- [ ] Código testado visualmente?
- [ ] Sem erros no console?
- [ ] Performance mantida (< 1.8s FCP)?

---

## 📚 REFERÊNCIAS

- **Next.js 14 Docs**: https://nextjs.org/docs
- **React Server Components**: https://react.dev/reference/rsc/server-components
- **WebAssembly**: https://webassembly.org/
- **Rust + WebAssembly**: https://rustwasm.github.io/

---

**Última atualização**: 2025-11-14  
**Status**: ✅ Atualizado e consolidado
