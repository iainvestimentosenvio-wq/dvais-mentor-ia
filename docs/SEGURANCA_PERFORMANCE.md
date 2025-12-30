# Seguranca e Performance

## Seguranca
- **Sanitizacao**: perguntas passam por `sanitizeQuestion`.
- **Allowlist de actions**: somente IDs e rotas permitidas.
- **Rate limit**: KV + fallback em memoria (evita abuso).
- **Circuit breaker**: bloqueia falhas repetidas e protege a API.
- **Prompt restritivo**: remove temas proibidos e evita solicitacao de dados sensiveis.

## Performance
- **KB primeiro**: respostas imediatas sem LLM quando possivel.
- **Cache em memoria + KV**: reduz latencia e custo.
- **IntersectionObserver**: evita listeners de scroll pesados.
- **Comets**: animacao com GPU (transform) e auto pause em `prefers-reduced-motion`.
- **Web Vitals**: coleta ativa em producao via `/api/metrics`.

## Boas praticas
- Manter respostas curtas para voz.
- Evitar re-renders desnecessarios em componentes grandes.
- Revisar logs periodicamente para detectar abuso.
- Seguir o budget definido em `docs/PERFORMANCE_BUDGET.md`.
