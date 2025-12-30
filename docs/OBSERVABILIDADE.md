# Observabilidade e Metricas

## Web Vitals
O componente `WebVitals` coleta as metricas CLS, FCP, FID, INP, LCP e TTFB.
Em producao, os dados sao enviados para `POST /api/metrics`.

## Endpoint de metricas
- **Rota**: `/api/metrics`
- **Metodo**: POST
- **Payload**:
```json
{ "name": "LCP", "value": 1500, "rating": "good", "path": "/" }
```

## Logs
- Logs operacionais sao salvos em `storage/logs/log_ops.jsonl`.
- Eventos de circuit breaker e rate limit tambem sao registrados.

## Indicadores recomendados
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Taxa de erro do assistente < 1%
