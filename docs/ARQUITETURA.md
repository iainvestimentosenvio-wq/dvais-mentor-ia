# Arquitetura do Sistema

## Resumo
A arquitetura e organizada em tres camadas principais:
1. **Frontend (Next.js)**: interface publica, assistente ao vivo, com destaque visual e navegação guiada.
2. **API (Route Handlers)**: aplica regras de segurança, consulta KB, aciona LLM quando necessario e valida actions.
3. **Infra local/KV**: cache, rate limit, circuit breaker e logs operacionais.

## Componentes principais
- **Assistente Live (UI)**: captura voz (STT), fala (TTS), entende contexto do clique e executa actions.
- **Base de Conhecimento (KB)**: respostas rápidas para perguntas comuns e ações de navegação.
- **API /api/assistente/perguntar**: valida entrada, aplica limites e retorna spokenText + actions.
- **Comets/Highlights**: camada visual para guiar o usuario (scroll, highlight, navegação).
- **API /api/metrics**: coleta Web Vitals para observabilidade.

## Diagrama de alto nivel
```mermaid
graph TD
  U[Usuario] -->|voz + clique| UI[Frontend Next.js]
  UI -->|POST /api/assistente/perguntar| API[API Assistente]
  API --> KB[Knowledge Base]
  API -->|fallback| LLM[LLM Groq/OpenRouter]
  API --> KV[(Vercel KV)]
  API --> LOGS[Logs Operacionais]
  UI --> COMETS[Comets + Highlight]
```

## Fluxo de resposta
```mermaid
sequenceDiagram
  participant User as Usuario
  participant UI as Frontend
  participant API as API Assistente
  participant KB as Knowledge Base
  participant LLM as LLM

  User->>UI: Pergunta + contexto de clique
  UI->>API: question, history, context
  API->>KB: match
  alt KB hit
    KB-->>API: entryId + actions
  else KB miss
    API->>LLM: prompt seguro
    LLM-->>API: spokenText + actions
  end
  API-->>UI: resposta validada
  UI->>UI: TTS + highlight/scroll
```

## Pontos criticos
- **Validador de actions**: bloqueia selectors livres e garante allowlist de IDs/rotas.
- **Rate limit + circuit breaker**: previnem abuso e falhas repetidas.
- **Cache**: evita recomputar respostas em sequencias curtas.
