# Estrutura do Projeto

```
apps/
  painel-web/
    app/                # Rotas e paginas (Next.js App Router)
    componentes/        # Componentes visuais e UI
    biblioteca/         # Modulos core (assistente, cache, rate limit)
    data/               # Mapeamento de elementos da pagina
    public/             # Assets estaticos
    tests/              # Testes E2E (Playwright)

packages/               # Pacotes compartilhados (se houver)
services/               # Servicos auxiliares
storage/                # Logs e dados locais
scripts/                # Scripts operacionais

docs/ (este diretorio)
```

## Pastas chave
- `apps/painel-web/componentes/Assistente`: UI e hooks do assistente live.
- `apps/painel-web/biblioteca/assistente`: KB, TTS/STT, intents, validadores.
- `apps/painel-web/app/api/assistente`: endpoint principal do assistente.
