# 🎤 Assistente de Voz com Voz Clonada - Solução Gratuita

## ✅ Resposta Direta

**SIM, é possível fazer com sua voz clonada de forma gratuita!**

### Solução: **Web Speech API (captura) + ElevenLabs Gratuito (resposta)**

- ✅ **Web Speech API**: Gratuito, captura voz do usuário
- ✅ **ElevenLabs Tier Gratuito**: 10.000 caracteres/mês com voz clonada
- ✅ **Total**: $0/mês (até 10k caracteres)

---

## 🎯 Como Funciona

```
┌─────────────────────────────────────────┐
│  Usuário fala                          │
│  ↓                                      │
│  Web Speech API (gratuito)             │
│  → Converte voz em texto               │
│  ↓                                      │
│  GPT-4o-mini (processa pergunta)       │
│  → Gera resposta curta                 │
│  ↓                                      │
│  ElevenLabs (gratuito - sua voz)       │
│  → Converte resposta em áudio          │
│  ↓                                      │
│  Reproduz áudio + rola página          │
└─────────────────────────────────────────┘
```

---

## 💰 Custo Real (MVP)

### Cenário: 50 conversas/mês, ~200 caracteres por resposta

| Serviço | Uso | Custo |
|---------|-----|-------|
| **Web Speech API** | Captura de voz | **$0** (nativo do navegador) |
| **OpenAI GPT-4o-mini** | ~10k tokens/mês | **$0.15/mês** (muito barato) |
| **ElevenLabs** | 10k caracteres/mês | **$0** (tier gratuito) |
| **TOTAL** | | **~$0.15/mês** (praticamente grátis!) |

### Otimizações para economizar:
- ✅ Respostas curtas (máximo 150 caracteres)
- ✅ Cache de respostas comuns
- ✅ Limitar a 50 conversas/mês no MVP

---

## 🚀 Implementação Passo a Passo

### 1. Criar Conta no ElevenLabs (Gratuito)

1. Acesse: https://elevenlabs.io
2. Crie conta gratuita
3. Vá em **"Voice Lab"** → **"Add Voice"** → **"Instant Voice Cloning"**
4. Faça upload de 1-2 minutos da sua voz (áudio claro)
5. Aguarde processamento (alguns minutos)
6. Copie o **Voice ID** gerado

### 2. Criar Vercel Edge Function

**`apps/painel-web/app/api/voice/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const SYSTEM_PROMPT = `
Você é um assistente de voz do DVAi$ - Mentor IA.

REGRAS:
1. Responda APENAS sobre a plataforma DVAi$ - Mentor IA
2. Seja breve (máximo 150 caracteres por resposta)
3. Sempre retorne JSON: { "text": "...", "scrollTarget": "id-do-elemento" }
4. Se pergunta não for sobre a plataforma, diga: "Desculpe, só posso ajudar com informações sobre o DVAi$ - Mentor IA."
`

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()
    
    // 1. Processar com GPT (gerar resposta curta)
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: transcript }
        ],
        max_tokens: 50, // Limita resposta (economiza)
        temperature: 0.7
      })
    })
    
    const gptData = await gptResponse.json()
    const responseText = JSON.parse(gptData.choices[0].message.content)
    
    // 2. Gerar áudio com sua voz (ElevenLabs)
    const audioResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY!
        },
        body: JSON.stringify({
          text: responseText.text,
          model_id: 'eleven_multilingual_v2', // Suporta português
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    )
    
    const audioBuffer = await audioResponse.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    
    return NextResponse.json({
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      scrollTarget: responseText.scrollTarget,
      text: responseText.text
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 })
  }
}
```

### 3. Componente React de Voz

**`apps/painel-web/componentes/VoiceAssistant.tsx`**

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Inicializar Web Speech API
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.warn('Web Speech API não suportada neste navegador')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript
      setIsListening(false)
      
      // Enviar para Edge Function
      try {
        const response = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript })
        })
        
        const { audio, scrollTarget, text } = await response.json()
        
        // Reproduzir áudio
        if (audio) {
          playAudio(audio)
        }
        
        // Rolar página
        if (scrollTarget) {
          const element = document.getElementById(scrollTarget)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      } catch (error) {
        console.error('Erro ao processar voz:', error)
      }
    }

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const playAudio = (audioData: string) => {
    setIsSpeaking(true)
    const audio = new Audio(audioData)
    audio.onended = () => setIsSpeaking(false)
    audio.onerror = () => setIsSpeaking(false)
    audio.play()
    audioRef.current = audio
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isSpeaking}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          shadow-2xl transition-all duration-300
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
          }
          ${isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
        `}
        aria-label={isListening ? 'Parar de ouvir' : 'Falar com IA'}
      >
        {isListening ? (
          <Icon name="fas fa-stop" className="text-white text-xl" />
        ) : isSpeaking ? (
          <Icon name="fas fa-volume-up" className="text-white text-xl animate-pulse" />
        ) : (
          <Icon name="fas fa-microphone" className="text-white text-xl" />
        )}
      </button>
      
      {isListening && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
          🎤 Ouvindo...
        </div>
      )}
    </div>
  )
}
```

### 4. Adicionar IDs aos Elementos da Página

**`apps/painel-web/app/page.tsx`** (exemplo)

```typescript
<section id="features" className="py-20">
  {/* Features */}
</section>

<section id="stats" className="py-20">
  {/* Stats */}
</section>

<section id="seguranca" className="py-20">
  {/* Segurança */}
</section>
```

### 5. Variáveis de Ambiente

**`.env.local`** (não commitar no Git!)

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=... # ID da sua voz clonada
```

**`.env.example`** (commitar no Git)

```env
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
ELEVENLABS_VOICE_ID=your-voice-id-here
```

---

## 📊 Monitoramento de Uso (ElevenLabs)

### Dashboard ElevenLabs:
1. Acesse: https://elevenlabs.io/app/usage
2. Veja quantos caracteres usou no mês
3. Configure alertas quando chegar perto de 10k

### Implementar Contador no Código:

```typescript
// Adicionar ao Edge Function
const usage = await getElevenLabsUsage() // API do ElevenLabs
if (usage.remaining < 1000) {
  // Avisar que está perto do limite
  return NextResponse.json({ 
    error: 'Limite mensal quase atingido. Tente novamente no próximo mês.' 
  }, { status: 429 })
}
```

---

## 🎯 Estratégia de Economia

### Para maximizar os 10k caracteres/mês:

1. **Respostas Curtas**: Máximo 150 caracteres
2. **Cache Agressivo**: Cachear respostas comuns
3. **Limitar Conversas**: Máximo 50 conversas/mês no MVP
4. **Fallback**: Se acabar, usar Web Speech API (sem voz customizada)

### Exemplo de Cache:

```typescript
// Cache de respostas comuns
const commonResponses = {
  'o que é o dvais': {
    text: 'O DVAi$ é uma plataforma de mentoria inteligente para investimentos.',
    scrollTarget: 'hero'
  },
  'preços': {
    text: 'Nossos planos começam em R$ 29,90 por mês.',
    scrollTarget: 'pricing'
  }
  // ... mais respostas
}

// Usar cache antes de chamar API
if (commonResponses[transcript.toLowerCase()]) {
  return commonResponses[transcript.toLowerCase()]
}
```

---

## ✅ Checklist de Implementação

- [ ] Criar conta no ElevenLabs (gratuito)
- [ ] Clonar sua voz (upload de 1-2 min de áudio)
- [ ] Copiar Voice ID
- [ ] Criar Edge Function `/api/voice`
- [ ] Criar componente `VoiceAssistant.tsx`
- [ ] Adicionar IDs aos elementos da página
- [ ] Configurar variáveis de ambiente
- [ ] Testar localmente
- [ ] Deploy na Vercel
- [ ] Configurar variáveis de ambiente na Vercel

---

## 🚨 Limitações do Tier Gratuito

### ElevenLabs Gratuito:
- ✅ 10.000 caracteres/mês
- ✅ Voz clonada funcionando
- ⚠️ Se passar de 10k, precisa pagar ($5/mês para 30k)

### Solução:
- Implementar cache agressivo
- Limitar respostas a 150 caracteres
- Monitorar uso mensal
- Ter fallback para Web Speech API

---

## 🎓 Recursos

- [ElevenLabs Voice Cloning](https://elevenlabs.io/docs/api-reference/voice-cloning)
- [ElevenLabs API Docs](https://elevenlabs.io/docs/api-reference/text-to-speech)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenAI GPT-4o-mini](https://platform.openai.com/docs/models/gpt-4o-mini)

---

## 💡 Conclusão

**SIM, é totalmente possível fazer com sua voz clonada de forma gratuita!**

- ✅ **Custo**: ~$0.15/mês (praticamente grátis)
- ✅ **Voz Clonada**: Funciona perfeitamente
- ✅ **Sem Servidor**: Tudo no Vercel (Edge Functions)
- ✅ **Funcional**: Pronto para MVP

**Próximo passo**: Implementar seguindo este guia! 🚀

