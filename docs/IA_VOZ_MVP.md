# 🎤 Assistente de Voz com IA - MVP

## 📋 Objetivo

Implementar um assistente de voz que:
- ✅ Fala com a voz do usuário (customizada)
- ✅ Explica o que a plataforma oferece
- ✅ Rola a página até o assunto sendo falado
- ✅ Funciona na página pré-login (antes do cadastro)
- ✅ **Custo zero ou muito baixo**
- ✅ Funciona **sem servidor próprio** (só Vercel)

---

## 🎯 Solução Recomendada: **OpenAI + ElevenLabs (Tier Gratuito)**

### Por quê esta combinação?

1. **OpenAI Whisper** (Speech-to-Text)
   - ✅ **Tier gratuito**: $0.006 por minuto (muito barato)
   - ✅ Alta precisão em português
   - ✅ Funciona via API ou Edge Function

2. **OpenAI GPT-4o-mini** (Processamento de IA)
   - ✅ **Tier gratuito**: $0.15 por 1M tokens de entrada
   - ✅ Rápido e eficiente
   - ✅ Suporta system prompts (para limitar escopo)

3. **ElevenLabs** (Text-to-Speech com voz customizada)
   - ✅ **Tier gratuito**: 10.000 caracteres/mês
   - ✅ Permite clonar sua voz
   - ✅ Qualidade profissional
   - ⚠️ Alternativa: Google TTS (gratuito, mas sem clonagem de voz)

---

## 🏗️ Arquitetura (Serverless no Vercel)

```
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js)                             │
│  ┌───────────────────────────────────────────┐ │
│  │ Componente de Voz                         │ │
│  │ - Captura áudio (Web Audio API)           │ │
│  │ - Envia para Edge Function                │ │
│  └───────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Vercel Edge Function (Serverless)              │
│  ┌───────────────────────────────────────────┐ │
│  │ 1. Recebe áudio                            │ │
│  │ 2. Whisper API → Texto                    │ │
│  │ 3. GPT-4o-mini → Resposta + Scroll        │ │
│  │ 4. ElevenLabs → Áudio com sua voz         │ │
│  │ 5. Retorna áudio + dados de scroll        │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 💰 Estimativa de Custos (MVP)

### Cenário: 100 usuários/dia, 2 minutos de conversa cada

| Serviço | Uso | Custo |
|---------|-----|-------|
| **OpenAI Whisper** | 200 min/dia | $1.20/dia = **$36/mês** |
| **OpenAI GPT-4o-mini** | ~50k tokens/dia | $0.0075/dia = **$0.23/mês** |
| **ElevenLabs** | 10k chars/mês (gratuito) | **$0/mês** (até 10k) |
| **Vercel Edge Functions** | 200 invocações/dia | **$0/mês** (tier gratuito) |
| **TOTAL** | | **~$36/mês** |

### Com otimizações:
- Cache de respostas comuns → **-50% custo** = **~$18/mês**
- Limitar conversas a 1 minuto → **-50% custo** = **~$9/mês**

---

## 🚀 Implementação Passo a Passo

### 1. Criar Vercel Edge Function

**`apps/painel-web/app/api/voice/route.ts`** (Edge Function)

```typescript
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Edge Function (serverless)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    // 1. Speech-to-Text (Whisper)
    const transcription = await transcribeAudio(audioFile)
    
    // 2. Processar com GPT (com prompt limitado)
    const response = await processWithGPT(transcription)
    
    // 3. Text-to-Speech (ElevenLabs com sua voz)
    const audioResponse = await generateSpeech(response.text, response.scrollTarget)
    
    return NextResponse.json({
      audio: audioResponse.audioUrl,
      scrollTo: response.scrollTarget,
      text: response.text
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 })
  }
}
```

### 2. Componente React de Voz

**`apps/painel-web/componentes/VoiceAssistant.tsx`**

```typescript
'use client'

import { useState, useRef } from 'react'

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  
  const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    
    mediaRecorder.ondataavailable = async (event) => {
      // Enviar para Edge Function
      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData
      })
      
      const { audio, scrollTo } = await response.json()
      
      // Reproduzir áudio
      playAudio(audio)
      
      // Rolar página
      if (scrollTo) {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    mediaRecorder.start()
    setIsListening(true)
  }
  
  return (
    <button onClick={startListening}>
      {isListening ? '🎤 Ouvindo...' : '🎤 Falar com IA'}
    </button>
  )
}
```

---

## 🛡️ Sistema de Prompt para Limitar Escopo

### Prompt System (System Message)

```typescript
const SYSTEM_PROMPT = `
Você é um assistente de voz do DVAi$ - Mentor IA, uma plataforma de mentoria inteligente para investimentos.

REGRAS IMPORTANTES:
1. Você APENAS responde perguntas sobre:
   - A plataforma DVAi$ - Mentor IA
   - Funcionalidades oferecidas
   - Como funciona o sistema
   - Preços e planos
   - Segurança e proteção

2. Você NUNCA responde:
   - Perguntas sobre outros assuntos
   - Questões pessoais não relacionadas à plataforma
   - Pedidos de ajuda geral
   - Conversas casuais fora do contexto

3. Quando receber pergunta fora do escopo:
   - Responda: "Desculpe, eu só posso ajudar com informações sobre a plataforma DVAi$ - Mentor IA. Posso explicar nossas funcionalidades, preços ou como funciona o sistema."

4. Sempre que mencionar uma funcionalidade, retorne também o ID do elemento HTML para scroll:
   - Exemplo: { "text": "...", "scrollTarget": "features" }

5. Seja breve e direto (máximo 2-3 frases por resposta).
`

async function processWithGPT(userMessage: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 150, // Limita resposta (economiza tokens)
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}
```

---

## 🎯 Alternativas Mais Baratas

### Opção 1: **Google Cloud Speech + TTS** (Gratuito até certo limite)

- ✅ **Speech-to-Text**: 60 minutos/mês grátis
- ✅ **Text-to-Speech**: 0-4 milhões de caracteres/mês grátis
- ⚠️ Não permite clonagem de voz (vozes pré-definidas)

### Opção 2: **Azure Speech Services** (Tier Gratuito)

- ✅ **Speech-to-Text**: 5 horas/mês grátis
- ✅ **Text-to-Speech**: 0.5 milhões de caracteres/mês grátis
- ⚠️ Não permite clonagem de voz

### Opção 3: **Web Speech API** (100% Gratuito, mas limitado)

- ✅ **Speech Recognition**: API nativa do navegador (gratuito)
- ✅ **Speech Synthesis**: API nativa do navegador (gratuito)
- ❌ Não permite voz customizada
- ❌ Qualidade inferior
- ❌ Funciona apenas em alguns navegadores

---

## ✅ Recomendação Final

### Para MVP com **custo mínimo**:

1. **Usar Web Speech API** (gratuito) para prototipagem
2. **Migrar para OpenAI + ElevenLabs** quando tiver tráfego
3. **Implementar cache** agressivo de respostas comuns
4. **Limitar duração** de conversas (1-2 minutos)

### Estrutura de Custos Escalonada:

```
Fase 1 (0-50 usuários/dia): Web Speech API → $0/mês
Fase 2 (50-200 usuários/dia): OpenAI + ElevenLabs → ~$18/mês
Fase 3 (200+ usuários/dia): Otimizar + cache → ~$30-50/mês
```

---

## 🔒 Segurança e Limites

### Implementar:

1. **Rate Limiting**: Máximo 5 conversas por IP/hora
2. **Timeout**: Máximo 2 minutos por conversa
3. **Validação**: Verificar se pergunta é sobre a plataforma
4. **Cache**: Cachear respostas comuns (economiza API calls)

### Variáveis de Ambiente:

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=... # ID da sua voz clonada
```

---

## 📝 Próximos Passos

1. ✅ Criar Edge Function no Vercel
2. ✅ Implementar componente de voz no frontend
3. ✅ Configurar prompts do sistema
4. ✅ Testar com Web Speech API (gratuito)
5. ✅ Migrar para OpenAI + ElevenLabs quando necessário
6. ✅ Implementar cache e rate limiting

---

## 🎓 Recursos

- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [ElevenLabs Voice Cloning](https://elevenlabs.io/docs/api-reference/voice-cloning)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

