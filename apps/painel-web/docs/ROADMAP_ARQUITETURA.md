# Roadmap de Arquitetura - DVAi$ Mentor IA

Este documento centraliza os links para documentação de arquitetura, relatórios locais e checklist do MVP.

---

## 📚 Documentação de Arquitetura

### Diagramas e Modelos

- **[Mapa Visual (draw.io)](../../docs/diagramas/mapa-geral.drawio)** - Diagrama principal com múltiplas páginas:
  - Visão Geral
  - Containers (C4 Level 2)
  - Componentes do Painel Web
  - Backlog MVP

- **[C4 Model (Structurizr)](../../docs/c4/workspace.dsl)** - Modelo C4 completo definido em DSL:
  - System Context
  - Containers
  - Components (Painel Web e Browser Extension)
  - Execute com Docker: `docker run -it --rm -p 8080:8080 -v ${PWD}/docs/c4:/usr/local/structurizr structurizr/lite`

### Documentos Principais

- **[Arquitetura Geral](../../docs/ARQUITETURA_GERAL.md)** - Visão geral do MVP, fluxos principais, decisões de segurança

- **[Escopo do MVP](../../docs/MVP_ESCOPO.md)** - O que entra e o que não entra no MVP, critérios de sucesso

- **[Baseline de Segurança](../../docs/SEGURANCA_BASELINE.md)** - Threat model, medidas de segurança, checklist de implementação

- **[Otimizações Executadas](../../docs/OTIMIZACOES_EXECUTADAS.md)** - Histórico de otimizações de performance, bundle size e conversões Server Component

---

## 📊 Relatórios Locais

### Lighthouse CI (LHCI)

**Localização:** `apps/painel-web/lhci/`

**Como gerar:**
```bash
npm run audit:lhci
```

**Conteúdo:**
- Relatórios HTML e JSON para cada rota auditada (`/`, `/login`, `/cadastro`, `/analise-tempo-real`)
- Gerado localmente e **gitignored** (não entra no repositório)
- Acesse os relatórios HTML diretamente no navegador após a execução

**Configuração:** `apps/painel-web/lighthouserc.json`

### Bundle Analyzer

**Localização:** `apps/painel-web/.next/analyze/client.html`

**Como gerar:**
```bash
npm run analyze
```

**Conteúdo:**
- Visualização interativa dos chunks JavaScript
- Tamanho de cada módulo e dependência
- Identificação de bibliotecas pesadas (tfjs, libphonenumber, fontawesome, etc.)

**Nota:** O arquivo é gerado em `.next/analyze/` após executar `npm run analyze`. Abra `client.html` no navegador.

---

## ✅ Checklist do MVP

### Front (Painel Web)

- ✅ Home + `/login` + `/cadastro` + `/analise-tempo-real`
- ✅ Otimizações (Comets, Header IO, AnimatedEye, etc.)
- ✅ LHCI e Bundle Analyzer configurados
- ⏭️ UI do "modo mentor": botão "Ativar mentoria"
- ⏭️ Painel de "status": WS conectado, latência, backend ok

### Extensão (Overlay Binance)

- ⏭️ Manifest v3 + overlay básico
- ⏭️ Captura de "elemento clicado" (sem ler senha/cookies)
- ⏭️ Modo seleção: usuário clica e pergunta
- 🔒 Redaction (não capturar `input type=password`, etc.)

### Backend API

- ⏭️ Auth (sessions/cookies httpOnly) + RBAC básico
- ⏭️ Rate limit + Audit log
- ⏭️ Endpoint `/mentor` (recebe evento do clique e contexto)

### Dados de Mercado (Binance WS)

- ⏭️ Serviço WS Binance (ticker, orderbook)
- ⏭️ Normalização + cache Redis
- ⏭️ Endpoint de consulta rápida pro Front/Extensão

### Segurança/Infra

- ✅ Baseline `docs/SEGURANCA_BASELINE.md` documentado
- ⏭️ CSP forte + headers (revisão)
- ⏭️ Segredos (env) + vault/managed secrets (planejado)
- ⏭️ Política de logs: nunca logar dados sensíveis

**Legenda:**
- ✅ = Pronto
- 🟡 = Em andamento
- ⏭️ = Próximo
- 🔒 = Segurança

---

## 🔄 Regra do Fluxo de Trabalho (OBRIGATÓRIA)

**Sempre siga esta sequência ao implementar features ou mudanças:**

```
1. Implementa → 
2. npm run build → 
3. npm run audit:lhci → 
4. atualiza mapa draw.io → 
5. marca checklist
```

### Detalhamento

1. **Implementa** - Desenvolve a feature/mudança no código
2. **`npm run build`** - Verifica se compila sem erros
3. **`npm run audit:lhci`** - Valida performance, acessibilidade, best practices e SEO
4. **Atualiza mapa draw.io** - Atualiza `docs/diagramas/mapa-geral.drawio` se houver mudanças arquiteturais:
   - Novos componentes → adiciona na página "3. Componentes"
   - Novas rotas → atualiza na página "3. Componentes"
   - Mudanças de fluxo → atualiza nas páginas relevantes
5. **Marca checklist** - Atualiza este documento (`ROADMAP_ARQUITETURA.md`) movendo itens de ⏭️ para 🟡 ou ✅

### Exceções

- **Apenas documentação**: Pode pular `npm run build` e `npm run audit:lhci`
- **Hotfix crítico**: Pode pular `npm run audit:lhci` se for urgente, mas **sempre** roda `npm run build`
- **Refatoração sem mudança funcional**: Pode pular atualização do draw.io se não houver impacto arquitetural

---

## 📝 Notas

- Todos os relatórios locais (LHCI, Bundle Analyzer) são **gitignored** e não devem ser commitados
- O mapa draw.io (`docs/diagramas/mapa-geral.drawio`) **deve** ser versionado e atualizado junto com mudanças arquiteturais
- Este documento (`ROADMAP_ARQUITETURA.md`) deve ser atualizado sempre que um item do checklist for concluído

---

**Última atualização:** 2025-01-27
