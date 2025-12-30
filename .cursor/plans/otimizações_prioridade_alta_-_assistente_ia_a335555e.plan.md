---
name: Otimizações Prioridade Alta - Assistente IA
overview: "Implementar 3 otimizações críticas de prioridade alta: scroll robusto com MutationObserver, TTS com Promise e fila, e ajustes de estabilidade (remover useDeferredValue não usado, estabilizar visibleElements). Todas as mudanças são cirúrgicas e não quebram funcionalidades existentes."
todos: []
---

# Plano de Otimiza

ções Prioridade Alta - Assistente IA

## Diagnóstico Técnico

### Riscos Identificados

1. **Loop STT↔TTS no modo contínuo**

- **Localização**: `Assistente.tsx:620-657` (useEffect que reinicia escuta)
- **Problema**: `speakText()` não retorna Promise, então usa timeout fixo de 2s. Se TTS demorar mais ou menos, STT pode capturar o próprio TTS ou reiniciar muito cedo.
- **Risco**: IA pode "se escutar" e criar loop infinito de perguntas/respostas.

2. **Scroll falha em SPAs/páginas com render async**

- **Localização**: `Assistente.tsx:389-454` (scroll pós-navegação)
- **Problema**: Retry fixo com `setTimeout` não detecta quando elemento está sendo carregado dinamicamente. Se elemento aparecer após 3 tentativas, scroll falha.
- **Risco**: Usuário navega mas não vê seção destacada automaticamente.

3. **Listeners/timers podem vazar**

- **Localização**: 
    - `Assistente.tsx:450` - timeout de scroll pode não ser limpo se componente desmontar
    - `Assistente.tsx:642` - timeout de reinício STT pode não ser limpo
    - `speechRecognition.ts:76` - silenceTimeoutId pode vazar em edge cases
- **Risco**: Memory leaks e timers executando após desmontagem.

4. **useDeferredValue não usado**

- **Localização**: `Assistente.tsx:25` - `deferredQuestion` declarado mas nunca usado
- **Problema**: Overhead desnecessário do React.

5. **visibleElements oscila rapidamente**

- **Localização**: `Assistente.tsx:77-113` - IntersectionObserver com threshold 0.3
- **Problema**: Mudanças rápidas podem causar re-renders desnecessários e oscilações no contexto enviado ao LLM.

## Implementações Prioridade Alta

### A) Scroll Robusto Pós-Navegação

**Arquivo**: `apps/painel-web/componentes/Assistente/Assistente.tsx`**Mudanças**:

1. Criar helper `waitForElement(selector, timeout)` usando `MutationObserver` + polling híbrido
2. Substituir retry fixo (linhas 407-447) por `waitForElement` com timeout claro
3. Garantir cleanup do observer e sessionStorage em todos os casos

**Implementação**:

```typescript
// Helper function (adicionar antes do componente)
function waitForElement(
  selector: string,
  timeout: number = 10000
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    // Verificar imediatamente
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      resolve(element)
      return
    }

    let observer: MutationObserver | null = null
    let timeoutId: number | null = null
    let resolved = false

    const cleanup = () => {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const checkAndResolve = (element: HTMLElement | null) => {
      if (!resolved && element) {
        resolved = true
        cleanup()
        resolve(element)
      }
    }

    // MutationObserver para detectar elementos adicionados
    observer = new MutationObserver(() => {
      const el = document.querySelector(selector) as HTMLElement
      checkAndResolve(el)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Timeout fallback
    timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true
        cleanup()
        const el = document.querySelector(selector) as HTMLElement
        resolve(el) // Retorna null se não encontrado
      }
    }, timeout) as any
  })
}
```

**Substituir scroll pós-navegação** (linhas 407-447):

```typescript
// Scroll com waitForElement
const scrollToTarget = async () => {
  const selector = getSelectorForTargetId(targetId)
  if (!selector) {
    sessionStorage.removeItem('pendingNavigation')
    return
  }

  try {
    const element = await waitForElement(selector, 10000) // 10s timeout
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Highlight visual (código existente)
      const prev = element.style.boxShadow
      element.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.7)'
      setTimeout(() => {
        element.style.boxShadow = prev
      }, 3500)

      sessionStorage.removeItem('pendingNavigation')
      // IA explica (código existente)
      // ...
    } else {
      sessionStorage.removeItem('pendingNavigation')
      setCaption('A seção está nesta página, role até encontrar.')
    }
  } catch (e) {
    sessionStorage.removeItem('pendingNavigation')
  }
}

// Executar após pequeno delay
setTimeout(() => scrollToTarget(), 300)
```



### B) TTS com Fila + Promise

**Arquivo**: `apps/painel-web/biblioteca/assistente/textToSpeech.ts`**Mudanças**:

1. Modificar `speakText()` para retornar `Promise<void>` que resolve quando fala termina
2. Manter fila existente (já implementada)
3. Adicionar flag `isSpeakingRef` para proteção anti-eco

**Implementação**:

```typescript
// Adicionar ref para rastrear se está falando
const isSpeakingRef = { current: false }

// Modificar processTTSMessage para retornar Promise
function processTTSMessage(message: TTSMessage): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve()
      return
    }

    window.speechSynthesis.cancel()
    currentUtterance = null
    isSpeakingRef.current = true

    try {
      const utter = new SpeechSynthesisUtterance(message.text)
      utter.lang = 'pt-BR'
      utter.rate = message.rate || 1.1
      utter.pitch = message.pitch || 1.0
      
      // ... (seleção de voz existente)

      utter.onend = () => {
        currentUtterance = null
        isProcessing = false
        isSpeakingRef.current = false
        resolve()
        processQueue()
      }

      utter.onerror = (error) => {
        currentUtterance = null
        isProcessing = false
        isSpeakingRef.current = false
        reject(error)
        processQueue()
      }

      currentUtterance = utter
      window.speechSynthesis.speak(utter)
      isProcessing = true
    } catch (error) {
      isProcessing = false
      isSpeakingRef.current = false
      currentUtterance = null
      reject(error)
      processQueue()
    }
  })
}

// Modificar processQueue para retornar Promise
function processQueue(): Promise<void> {
  return new Promise((resolve) => {
    if (isProcessing || messageQueue.length === 0) {
      resolve()
      return
    }

    const message = messageQueue.shift()
    if (!message) {
      resolve()
      return
    }

    processTTSMessage(message).then(resolve).catch(() => resolve())
  })
}

// Modificar speakText para retornar Promise
export async function speakText(text: string): Promise<void> {
  const trimmed = text.slice(0, 400)
  const endpoint = process.env.NEXT_PUBLIC_TTS_URL
  
  // Tentar endpoint externo primeiro (manter código existente)
  if (endpoint) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: process.env.NEXT_PUBLIC_TTS_TOKEN ?? '' },
        body: JSON.stringify({ text: trimmed, voice: process.env.NEXT_PUBLIC_TTS_VOICE ?? 'default' }),
      })
      const data = await resp.json().catch(() => ({}))
      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl)
        await audio.play()
        return
      }
    } catch {
      /* fallback abaixo */
    }
  }

  // Usar SpeechSynthesis com queue system
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const messageId = `msg_${Date.now()}`
    const message: TTSMessage = {
      id: messageId,
      text: trimmed,
      rate: 1.1,
      pitch: 1.0,
    }

    messageQueue.push(message)
    return processQueue()
  }
  
  return Promise.resolve()
}

// Exportar flag para verificação
export function isSpeaking(): boolean {
  return isSpeakingRef.current
}
```

**Arquivo**: `apps/painel-web/componentes/Assistente/Assistente.tsx`**Mudanças no modo contínuo**:

1. Parar STT antes de chamar TTS
2. Aguardar `await speakText()` antes de reiniciar STT
3. Usar flag `isSpeaking()` para proteção adicional

**Substituir** (linhas 561 e 620-657):

```typescript
// Em handleAsk, após receber resposta:
if (useVoice && ttsAvailable) {
  // Parar STT antes de TTS (se modo contínuo)
  if (continuousMode && isListening) {
    stopSpeechRecognition()
    speechCleanupRef.current?.()
    speechCleanupRef.current = null
    setIsListening(false)
  }
  
  await speakText(spoken) // Aguardar término do TTS
}

// No useEffect de reinício (linhas 620-657):
useEffect(() => {
  if (
    continuousMode && 
    useVoice && 
    !isThinking && 
    !isListening && 
    isActive && 
    qaAnswer && 
    qaAnswer !== lastAnswerRef.current &&
    !isSpeaking() // Proteção adicional
  ) {
    lastAnswerRef.current = qaAnswer
    
    // Não precisa mais de timeout fixo - TTS já terminou
    // Verificar novamente antes de reiniciar
    if (
      startContinuousListeningRef.current && 
      continuousMode && 
      isActive && 
      !isThinking && 
      !isListening &&
      !isSpeaking()
    ) {
      startContinuousListeningRef.current()
    }
  }
}, [continuousMode, useVoice, isThinking, isListening, isActive, qaAnswer])
```



### C) Ajustes de Estabilidade

**Arquivo**: `apps/painel-web/componentes/Assistente/Assistente.tsx`**Mudança 1: Remover useDeferredValue não usado**

- Remover linha 2: `useDeferredValue` do import
- Remover linha 25: `const deferredQuestion = useDeferredValue(question)`
- Remover comentário linha 767 sobre useDeferredValue

**Mudança 2: Estabilizar visibleElements**

- Aumentar threshold de 0.3 para 0.5 (50% visível)
- Adicionar debounce de 200ms nas atualizações
- Usar ref para acumular mudanças antes de atualizar estado

**Implementação**:

```typescript
// Substituir useEffect de visibleElements (linhas 77-113)
useEffect(() => {
  if (typeof window === 'undefined' || !isActive) return

  const visibleSet = new Set<string>()
  let debounceTimer: number | null = null

  const updateVisibleElements = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      setVisibleElements(Array.from(visibleSet))
      debounceTimer = null
    }, 200) as any
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          visibleSet.add(entry.target.id)
        } else if (entry.target.id) {
          visibleSet.delete(entry.target.id)
        }
      })
      updateVisibleElements()
    },
    { threshold: 0.5 } // Aumentado de 0.3 para 0.5
  )

  const targetIds = [
    'hero-content',
    'features-section',
    'stats-section',
    'analise-hero',
    'seguranca-hero',
    'aprendizado-hero',
  ]

  targetIds.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      observer.observe(element)
    }
  })

  return () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    observer.disconnect()
  }
}, [isActive])
```



## Checklist de Testes

### Teste 1: Modo Texto

- [ ] Ativar assistente em modo texto
- [ ] Fazer pergunta e verificar resposta
- [ ] Verificar scroll automático funciona
- [ ] Verificar highlight visual funciona

### Teste 2: Voz Manual

- [ ] Ativar assistente em modo voz manual
- [ ] Clicar no microfone e falar
- [ ] Verificar que TTS não sobrepõe STT
- [ ] Verificar que precisa clicar "Perguntar" após falar

### Teste 3: Conversa Contínua

- [ ] Ativar modo "Conversa Contínua"
- [ ] Falar uma pergunta
- [ ] Verificar que STT para antes do TTS começar
- [ ] Verificar que TTS termina antes de STT reiniciar
- [ ] Verificar que IA não "se escuta" (STT não captura TTS)
- [ ] Fazer múltiplas perguntas seguidas e verificar estabilidade

### Teste 4: Navegação com Highlight

- [ ] Fazer pergunta que requer navegação
- [ ] Verificar comets destacam botão correto
- [ ] Clicar no botão destacado
- [ ] Verificar scroll automático na página destino funciona
- [ ] Verificar highlight visual na seção destino

### Teste 5: Página Dinâmica/Lenta

- [ ] Criar página de teste com elemento que aparece após 3s
- [ ] Fazer pergunta que requer scroll para esse elemento
- [ ] Verificar que MutationObserver detecta elemento
- [ ] Verificar que scroll acontece quando elemento aparece
- [ ] Verificar timeout de 10s funciona se elemento não aparecer

### Teste 6: Memory Leaks

- [ ] Abrir DevTools → Performance → Memory
- [ ] Ativar e desativar assistente múltiplas vezes
- [ ] Verificar que não há crescimento constante de memória
- [ ] Verificar que timers são limpos corretamente

## Arquivos a Modificar

1. `apps/painel-web/componentes/Assistente/Assistente.tsx`

- Adicionar `waitForElement` helper
- Substituir scroll pós-navegação
- Remover `useDeferredValue`
- Estabilizar `visibleElements`
- Modificar modo contínuo para usar Promise do TTS

2. `apps/painel-web/biblioteca/assistente/textToSpeech.ts`

- Modificar `speakText()` para retornar Promise
- Adicionar `isSpeakingRef` e função `isSpeaking()`
- Modificar `processTTSMessage` para retornar Promise

## Critérios de Aceite

- [ ] Scroll funciona em páginas com elementos dinâmicos (MutationObserver detecta)
- [ ] TTS retorna Promise e modo contínuo aguarda término antes de reiniciar STT
- [ ] IA não "se escuta" (teste manual: falar enquanto IA fala)
- [ ] `useDeferredValue` removido sem quebrar funcionalidade
- [ ] `visibleElements` não oscila rapidamente (verificar no DevTools)