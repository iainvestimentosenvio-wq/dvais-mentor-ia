# Execucao Local

## Requisitos
- Node.js 18+
- npm

## Passo a passo
```bash
cd apps/painel-web
npm install
npm run dev
```
A aplicacao inicia em `http://localhost:3000`.

## Variaveis de ambiente
Crie um `.env.local` dentro de `apps/painel-web` se necessario.

Obrigatorias (LLM):
- `GROQ_API_KEY` ou `OPENROUTER_API_KEY`

Opcionais:
- `NEXT_PUBLIC_ASSISTENTE_TEXT_DEBUG=true` (libera modo texto)
- `NEXT_PUBLIC_VITALS_DEBUG=true` (envia Web Vitals em dev)
