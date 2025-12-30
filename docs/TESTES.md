# Testes

## Unitarios
```bash
cd apps/painel-web
npm run test:unit
```

## E2E (Playwright)
```bash
cd apps/painel-web
npm run test:e2e
```

## Visual (snapshots)
```bash
cd apps/painel-web
npm run test:e2e -- --update-snapshots
```

## Observacao
Os artefatos do Playwright ficam em `apps/painel-web/playwright-report` e `apps/painel-web/test-results`.
