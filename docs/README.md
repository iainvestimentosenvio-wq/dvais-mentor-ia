# Documentacao - DVAi$ Mentor IA

Este diretorio concentra toda a documentacao atual do projeto.

## Visao geral
O DVAi$ e uma plataforma de investimentos com IA que guia o usuario em tempo real, usando voz, destaque visual e uma base de conhecimento para explicar as areas publicas do site.

## Mapa rapido
- `docs/ARQUITETURA.md` - visão geral e fluxos principais do sistema.
- `docs/ASSISTENTE_LIVE.md` - funcionamento do assistente ao vivo (voz + seleção).
- `docs/API.md` - endpoints e contratos da API.
- `docs/EXECUCAO_LOCAL.md` - como rodar localmente.
- `docs/TESTES.md` - como executar testes unitarios e e2e.
- `docs/SEGURANCA_PERFORMANCE.md` - controles de segurança e performance.
- `docs/ESTRUTURA_PROJETO.md` - estrutura de pastas e modulos.
- `docs/OPERACAO_PRODUCAO.md` - deploy, rollback e checklist de operacao.
- `docs/OBSERVABILIDADE.md` - web vitals, logs e indicadores recomendados.
- `docs/PERFORMANCE_BUDGET.md` - orcamento de performance e metas.

## Atalhos
- Iniciar ambiente local: `npm run dev` (em `apps/painel-web`).
- Rodar testes unitarios: `npm run test:unit`.
- Rodar testes e2e: `npm run test:e2e`.

## Observacoes
- O modo texto do assistente fica oculto por padrao e so aparece com `NEXT_PUBLIC_ASSISTENTE_TEXT_DEBUG=true`.
- O assistente funciona nas paginas publicas antes do login.
