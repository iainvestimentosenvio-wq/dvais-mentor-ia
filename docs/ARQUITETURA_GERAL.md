# Arquitetura Geral - DVAi$ Mentor IA MVP

## Visão do MVP

O MVP do DVAi$ Mentor IA é um sistema de mentoria financeira que funciona como **extensão de navegador** (Browser Extension) com overlay na Binance, permitindo que investidores recebam orientações de IA diretamente enquanto operam na plataforma de corretagem.

### Princípios Fundamentais

1. **Não custodiar credenciais**: A extensão nunca captura, armazena ou transmite senhas ou cookies da Binance
2. **Overlay não invasivo**: Interface sobreposta (overlay) que aparece por clique do usuário, sem iframe
3. **Dados via WebSocket**: Conexão direta com Binance WebSocket para dados de mercado em tempo real
4. **IA via API**: Processamento de IA feito no backend, não no cliente

## Fluxos Principais

### 1. Fluxo Completo: Clique na Binance → Extensão → Backend → WebSocket/Cache → IA → Resposta no Overlay

**Este é o fluxo principal do MVP:**

```
Usuário na Binance (página de trading)
    ↓
Clica no botão da extensão (ícone na barra)
    ↓
Data Capture (Content Script) captura contexto:
    - Símbolo do ativo (ex: BTCUSDT) ✅
    - Preço atual (público) ✅
    - Timestamp ✅
    - [REDACTED: saldo, quantidade, IDs de ordens] ❌
    ↓
Overlay aparece na página Binance
    ↓
Overlay envia dados redacted para Backend API (HTTPS)
    ↓
Backend API:
    - Valida autenticação (JWT)
    - Aplica rate limiting (Redis)
    - Registra ação (Audit Log → Postgres)
    ↓
Backend API consulta Market Data Service:
    - Verifica cache no Redis
    - Se não houver, Market Data Service obtém via WebSocket Binance
    - Normaliza e armazena no Redis
    ↓
Backend API envia contexto para AI Orchestrator:
    - Dados de mercado (do cache)
    - Histórico de conversas (Postgres)
    - Pergunta do usuário
    ↓
AI Orchestrator:
    - Consulta catálogo de provedores (OpenAI, Anthropic, etc.)
    - Constrói contexto completo
    - Chama API do provedor de IA selecionado
    - Processa e contextualiza resposta
    ↓
AI Orchestrator retorna resposta para Backend API
    ↓
Backend API:
    - Armazena conversa no Postgres
    - Cacheia resposta no Redis (opcional)
    - Registra ação no Audit Log
    ↓
Backend API retorna resposta para Browser Extension
    ↓
Overlay exibe mentoria na página Binance
    ↓
Usuário vê resposta do Mentor IA diretamente na Binance
```

### 2. Fluxo de Dados de Mercado (WebSocket + Cache)

```
Binance WebSocket (stream de dados públicos)
    ↓
Market Data Service (WebSocket Client):
    - Conecta e mantém conexão ativa
    - Recebe dados em tempo real
    - Reconexão automática em caso de queda
    ↓
Normalizer:
    - Normaliza formato dos dados
    - Valida dados recebidos
    - Transforma para formato interno
    ↓
Cache Manager:
    - Armazena dados normalizados no Redis
    - TTL configurável (ex: 5 minutos)
    - Atualiza cache continuamente
    ↓
Backend API consulta Market Data Service:
    - Verifica cache no Redis primeiro
    - Se cache hit: retorna imediatamente
    - Se cache miss: Market Data Service busca do WebSocket
    ↓
Backend API retorna dados para Browser Extension
    ↓
Overlay mostra dados de mercado em tempo real
```

### 3. Fluxo de Processamento IA (Catálogo + API)

```
Usuário solicita análise via Overlay
    ↓
Browser Extension → Backend API (POST /api/ai/chat)
    ↓
Backend API valida e aplica rate limiting
    ↓
Backend API → AI Orchestrator (com contexto)
    ↓
AI Orchestrator:
    1. Consulta AI Catalog (catálogo de provedores disponíveis)
    2. Seleciona provedor baseado em:
       - Disponibilidade
       - Custo
       - Tipo de requisição
    3. Context Builder constrói contexto:
       - Histórico de conversas (Postgres)
       - Dados de mercado atuais (Redis)
       - Preferências do usuário
    4. AI Client chama API do provedor (OpenAI, Anthropic, etc.)
    ↓
Provedor de IA retorna resposta
    ↓
AI Orchestrator:
    - Processa resposta
    - Contextualiza com dados de mercado
    - Formata para exibição
    ↓
AI Orchestrator → Backend API (resposta processada)
    ↓
Backend API:
    - Armazena conversa no Postgres
    - Cacheia resposta no Redis (opcional, TTL curto)
    - Registra no Audit Log
    ↓
Backend API → Browser Extension
    ↓
Overlay exibe mentoria formatada
```

## Componentes e Containers

### Containers (C4 Level 2)

#### 1. Browser Extension (Overlay na Binance)
- **Tecnologia**: Chrome Extension (Manifest V3)
- **Responsabilidades**:
  - Renderizar overlay na página da Binance
  - Capturar dados visíveis na tela (com redaction)
  - Comunicar com Backend API via HTTPS
  - Exibir mentoria e alertas
- **Segurança**:
  - `host_permissions` apenas para `binance.com`
  - Sem acesso a cookies/storage sensível
  - Redaction de dados antes de enviar

#### 2. Painel Web
- **Tecnologia**: Next.js 14 (App Router)
- **Responsabilidades**:
  - Landing page e marketing
  - Dashboard de configurações (quando necessário)
  - Download da extensão
- **Status**: Implementado

#### 3. Backend API
- **Tecnologia**: Node.js (Express/Fastify)
- **Responsabilidades**:
  - Receber requisições da extensão
  - Orquestrar chamadas para AI Orchestrator
  - Gerenciar autenticação/autorização
  - Rate limiting e audit log
  - Cache de respostas (Redis)
- **Status**: MVP

#### 4. Market Data Service (Binance WS)
- **Tecnologia**: Node.js (WebSocket client)
- **Responsabilidades**:
  - Conectar com Binance WebSocket
  - Receber dados de mercado em tempo real
  - Armazenar em Redis (cache)
  - Distribuir via WebSocket/SSE para extensão
- **Status**: MVP

#### 5. AI Orchestrator
- **Tecnologia**: Node.js (Python opcional)
- **Responsabilidades**:
  - Gerenciar chamadas para provedores de IA
  - Contextualizar respostas com dados de mercado
  - Gerenciar histórico de conversas (Postgres)
  - Rate limiting por usuário
- **Status**: MVP

#### 6. Redis
- **Tecnologia**: Redis
- **Responsabilidades**:
  - Cache de dados de mercado
  - Cache de respostas de IA
  - Rate limiting counters
  - Sessões temporárias
- **Status**: MVP

#### 7. Postgres
- **Tecnologia**: PostgreSQL
- **Responsabilidades**:
  - Armazenar histórico de conversas
  - Audit logs
  - Configurações de usuário
  - Metadados de sessões
- **Status**: MVP

## MVP vs Futuro

### O que é MVP ✅

- **Browser Extension** com overlay na Binance
- **Painel Web** com landing page, login, chat/voz básico e alertas WhatsApp
- **Backend API** com auth, rate limiting, audit log
- **Market Data Service** com WebSocket Binance e cache Redis
- **AI Orchestrator** com catálogo de provedores e chamadas via API
- **Storage**: Postgres (histórico, logs) + Redis (cache, rate limit)

### O que é Futuro 🔜

- **Vector DB** para memória persistente avançada (contexto de longo prazo)
- **Análise técnica avançada** com backtesting
- **Múltiplas corretoras** além da Binance
- **Execução automática de ordens** (com segurança avançada)
- **Text-to-speech** (output de voz)
- **Dashboard web completo** com todas as funcionalidades

## MVP vs Futuro

### O que é MVP ✅

- **Browser Extension com Overlay**: Interface principal na Binance
- **Painel Web**: Landing page, login, chat/voz básico, alertas WhatsApp
- **Backend API**: Auth, regras, rate-limit, auditoria
- **Market Data Service**: WebSocket Binance + cache Redis
- **AI Orchestrator**: Catálogo de provedores + chamadas via API
- **Storage**: Postgres (histórico, logs) + Redis (cache, rate-limit)

### O que é Futuro 🔜

- **Vector DB**: Memória persistente avançada para contexto de conversas
- **Múltiplas Corretoras**: Suporte além da Binance
- **Execução Automática**: Ordens automáticas (com segurança avançada)
- **Análise Técnica Avançada**: Backtesting, indicadores complexos
- **Dashboard Web Completo**: Todas as funcionalidades no site
- **Text-to-Speech**: Output de voz (não apenas input)

## Decisões de Segurança

### 1. Não Custodiar Senhas/Cookies

**Decisão**: A extensão nunca acessa, armazena ou transmite credenciais da Binance.

**Implementação**:
- Sem permissão `cookies` no manifest
- Sem acesso a `document.cookie` ou `chrome.cookies` API
- Validação de código: linter bloqueia uso de APIs de cookies

### 2. Redaction de Dados

**Decisão**: Dados sensíveis são redacted antes de enviar para o backend.

**Implementação**:
- Função `redactSensitiveData()` remove:
  - Saldos de conta
  - Quantidades de ativos
  - IDs de ordens
  - Endereços de carteira
- Apenas símbolos, preços públicos e timestamps são enviados

### 3. Permissões Mínimas da Extensão

**Decisão**: A extensão solicita apenas permissões estritamente necessárias.

**Manifest V3**:
```json
{
  "host_permissions": [
    "https://binance.com/*"
  ],
  "permissions": [
    "activeTab",
    "storage"
  ]
}
```

**Não inclui**:
- ❌ `cookies`
- ❌ `webRequest` (exceto se necessário para overlay)
- ❌ `tabs` (exceto activeTab)
- ❌ `history`
- ❌ `bookmarks`

### 4. Comunicação Segura

**Decisão**: Toda comunicação usa HTTPS e validação de certificados.

**Implementação**:
- Backend API com TLS 1.3
- Validação de certificado no cliente
- Headers de segurança (CSP, HSTS, etc.)

### 5. Rate Limiting

**Decisão**: Limites de requisições por usuário para prevenir abuso.

**Implementação**:
- Redis para contadores
- Limites por IP e por usuário autenticado
- Backoff exponencial em caso de limite excedido

### 6. Audit Log

**Decisão**: Todas as ações são registradas para auditoria.

**Implementação**:
- Logs estruturados em Postgres
- Inclui: timestamp, usuário, ação, IP, user-agent
- Retenção: 90 dias (conforme LGPD)

## Arquitetura de Dados

### Dados Capturados pela Extensão

**Permitidos**:
- ✅ Símbolo do ativo (ex: "BTCUSDT")
- ✅ Preço atual (público)
- ✅ Timestamp
- ✅ Indicadores técnicos visíveis (se públicos)

**Bloqueados (redacted)**:
- ❌ Saldo da conta
- ❌ Quantidade de ativos
- ❌ IDs de ordens
- ❌ Endereços de carteira
- ❌ Histórico de transações

### Fluxo de Dados

```
Binance (página) → Extensão (captura redacted) → Backend API → AI Orchestrator
                                                                    ↓
                                                              Provedores IA
                                                                    ↓
Provedores IA → AI Orchestrator → Backend API → Extensão → Overlay (Binance)
```

## Integrações Externas

### Binance
- **Tipo**: WebSocket (dados de mercado)
- **Autenticação**: Não requerida (dados públicos)
- **Rate Limits**: Respeitados via backoff

### Provedores de IA
- **Tipo**: REST API (OpenAI, Anthropic, etc.)
- **Autenticação**: API keys (armazenadas no backend, não na extensão)
- **Rate Limits**: Gerenciados pelo AI Orchestrator

## Escalabilidade

### Horizontal Scaling
- Backend API: Stateless, pode escalar horizontalmente
- Market Data Service: Pode ter múltiplas instâncias (WebSocket connection pooling)
- Redis: Cluster mode para alta disponibilidade
- Postgres: Read replicas para queries

### Vertical Scaling
- AI Orchestrator: Pode escalar verticalmente para processamento pesado
- Redis: Cache em memória, pode aumentar RAM

## Monitoramento e Observabilidade

### Métricas
- Latência de respostas de IA
- Taxa de erro de requisições
- Uso de cache (hit rate)
- Taxa de rate limiting

### Logs
- Audit logs (Postgres)
- Application logs (stdout/stderr → aggregator)
- Error tracking (Sentry ou similar)

### Alertas
- Taxa de erro > 5%
- Latência P95 > 2s
- Rate limiting ativo > 10% das requisições

---

**Última atualização:** 2025-01-27  
**Versão:** MVP 1.0
