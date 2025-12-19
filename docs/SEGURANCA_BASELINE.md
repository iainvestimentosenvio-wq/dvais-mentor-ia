# Segurança Baseline - DVAi$ Mentor IA

Este documento define o baseline de segurança para o MVP do DVAi$ Mentor IA, incluindo threat model, medidas de proteção e checklist de implementação.

## Threat Model Básico

### 1. Phishing

**Ameaça**: Atacante cria extensão falsa que se passa pelo DVAi$ Mentor IA para roubar credenciais.

**Vetores**:
- Extensão maliciosa na Chrome Web Store
- Site de download falso
- Email/SMS com link para extensão falsa

**Mitigação**:
- ✅ Verificação de identidade na Chrome Web Store (verificado publisher)
- ✅ Site oficial com HTTPS e certificado válido
- ✅ Comunicação clara sobre como baixar a extensão oficial
- ✅ Verificação de assinatura da extensão (code signing)

### 2. Exfiltração de Dados

**Ameaça**: Atacante extrai dados sensíveis do usuário (saldos, ordens, histórico).

**Vetores**:
- Extensão comprometida envia dados para servidor malicioso
- Backend comprometido vaza dados
- Man-in-the-middle (MITM) na comunicação

**Mitigação**:
- ✅ Redaction de dados sensíveis antes de enviar
- ✅ HTTPS obrigatório (TLS 1.3)
- ✅ Validação de certificado no cliente
- ✅ CORS restrito
- ✅ CSP (Content Security Policy) no backend
- ✅ Encrypt data at rest (Postgres)

### 3. XSS (Cross-Site Scripting)

**Ameaça**: Atacante injeta JavaScript malicioso que executa no contexto da extensão ou overlay.

**Vetores**:
- Input do usuário não sanitizado
- Dados da Binance não sanitizados antes de exibir
- CSP fraco

**Mitigação**:
- ✅ Sanitização de todos os inputs
- ✅ CSP restritivo na extensão
- ✅ Escape de HTML/JavaScript em dados exibidos
- ✅ Validação de dados da Binance antes de processar
- ✅ Uso de frameworks seguros (React com proteções XSS)

### 4. Token Leakage

**Ameaça**: Tokens de autenticação (JWT, API keys) são expostos ou roubados.

**Vetores**:
- Token em localStorage acessível via XSS
- Token em logs do servidor
- Token transmitido via HTTP (não HTTPS)
- Token em cache do navegador

**Mitigação**:
- ✅ Tokens em httpOnly cookies (quando possível)
- ✅ Tokens com expiração curta (15 minutos)
- ✅ Refresh tokens separados
- ✅ Rotação de tokens
- ✅ Logs não contêm tokens completos (apenas hash)
- ✅ HTTPS obrigatório

### 5. Abuso de API

**Ameaça**: Atacante faz requisições excessivas para esgotar recursos ou causar DoS.

**Vetores**:
- Rate limiting ausente ou fraco
- Sem autenticação/autorização
- Sem limites por usuário

**Mitigação**:
- ✅ Rate limiting por IP e por usuário
- ✅ Autenticação obrigatória para endpoints sensíveis
- ✅ Throttling progressivo (backoff exponencial)
- ✅ Monitoramento de padrões anômalos
- ✅ WAF (Web Application Firewall) opcional

## Medidas de Segurança

### 1. Rate Limiting

**Implementação**:
- Redis para contadores distribuídos
- Limites por IP: 100 req/min (não autenticado)
- Limites por usuário: 1000 req/min (autenticado)
- Limites por endpoint:
  - `/api/ai/chat`: 10 req/min por usuário
  - `/api/market-data`: 60 req/min por usuário
  - `/api/auth/*`: 5 req/min por IP

**Backoff**:
- 429 Too Many Requests após limite
- Retry-After header com tempo de espera
- Backoff exponencial: 1s, 2s, 4s, 8s, 16s (max)

### 2. Audit Log

**Implementação**:
- Tabela `audit_logs` no Postgres
- Campos: `timestamp`, `user_id`, `ip_address`, `user_agent`, `action`, `resource`, `status_code`, `metadata` (JSON)
- Índices em `user_id`, `timestamp`, `action`
- Retenção: 90 dias (conforme LGPD)

**Eventos registrados**:
- Login/logout
- Requisições de IA
- Acessos a dados sensíveis
- Mudanças de configuração
- Erros de autenticação
- Rate limit excedido

### 3. Encryption at Rest

**Implementação**:
- Postgres: TDE (Transparent Data Encryption) ou volume criptografado
- Redis: Dados sensíveis não armazenados (apenas cache temporário)
- Backups: Criptografados (AES-256)
- Secrets: Gerenciados via Vault ou similar

**Dados criptografados**:
- Histórico de conversas (campos sensíveis)
- Configurações de usuário (se contiverem dados sensíveis)
- Audit logs (IPs, user-agents)

### 4. Secrets Management

**Implementação**:
- Variáveis de ambiente para secrets (não commitadas)
- Secrets rotacionados regularmente
- Acesso restrito a secrets (RBAC)
- Logs não expõem secrets

**Secrets gerenciados**:
- API keys de provedores de IA
- Chaves de criptografia
- Tokens JWT secret
- Credenciais de banco de dados
- Chaves de API da Binance (se necessário)

### 5. CSP (Content Security Policy)

**Implementação**:
- Header `Content-Security-Policy` em todas as respostas
- CSP restritivo na extensão
- CSP no backend API

**Política exemplo**:
```
default-src 'self';
script-src 'self' 'unsafe-inline' (apenas se necessário);
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.openai.com;
frame-ancestors 'none';
```

### 6. Sanitização

**Implementação**:
- Sanitização de inputs do usuário
- Sanitização de dados da Binance antes de processar
- Escape de HTML/JavaScript em outputs
- Validação de tipos e formatos

**Bibliotecas**:
- `DOMPurify` para sanitização de HTML
- `validator.js` para validação de inputs
- `zod` para validação de schemas TypeScript

### 7. RBAC (Role-Based Access Control)

**Implementação**:
- Roles: `user`, `admin`, `support`
- Permissões por endpoint
- Validação de permissões em middleware

**Permissões**:
- `user`: Acesso a IA, market data, configurações próprias
- `admin`: Acesso a logs, métricas, configurações globais
- `support`: Acesso a logs de usuários (apenas leitura)

## Segurança da Extensão

### 1. Permissões Mínimas

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

**Não incluir**:
- ❌ `cookies`
- ❌ `webRequest` (exceto se necessário)
- ❌ `tabs` (exceto activeTab)
- ❌ `history`
- ❌ `bookmarks`
- ❌ `downloads`

### 2. Sem Cookies

**Decisão**: Extensão nunca acessa cookies da Binance.

**Implementação**:
- Sem permissão `cookies` no manifest
- Código não usa `chrome.cookies` API
- Linter bloqueia uso de APIs de cookies
- Validação em code review

### 3. Sem Storage Sensível

**Decisão**: Extensão não armazena dados sensíveis localmente.

**Implementação**:
- `chrome.storage.local` apenas para:
  - Configurações de UI (tema, preferências)
  - Cache de tokens (temporário, com expiração)
- Nunca armazenar:
  - Saldos
  - Quantidades de ativos
  - Histórico de transações
  - Credenciais

### 4. Redaction Antes de Enviar

**Decisão**: Dados sensíveis são redacted antes de enviar para backend.

**Implementação**:
- Função `redactSensitiveData(data)` remove:
  - Saldos de conta
  - Quantidades de ativos
  - IDs de ordens
  - Endereços de carteira
  - Números de telefone/email (se capturados)
- Apenas dados públicos são enviados:
  - Símbolos de ativos
  - Preços públicos
  - Timestamps
  - Indicadores técnicos (se públicos)

**Exemplo**:
```typescript
function redactSensitiveData(data: BinanceData): RedactedData {
  return {
    symbol: data.symbol, // ✅ Permitido
    price: data.price, // ✅ Permitido
    timestamp: data.timestamp, // ✅ Permitido
    // balance: data.balance, // ❌ Removido
    // quantity: data.quantity, // ❌ Removido
  };
}
```

## Checklist de Implementação

### Backend API
- [ ] Rate limiting implementado (Redis)
- [ ] Audit log implementado (Postgres)
- [ ] Encryption at rest (Postgres TDE ou volume criptografado)
- [ ] Secrets management (variáveis de ambiente, Vault)
- [ ] CSP headers configurados
- [ ] Sanitização de inputs
- [ ] RBAC implementado
- [ ] HTTPS obrigatório (TLS 1.3)
- [ ] Validação de certificado
- [ ] CORS restrito
- [ ] Logs não expõem tokens/secrets

### Browser Extension
- [ ] Permissões mínimas no manifest
- [ ] Sem permissão `cookies`
- [ ] Redaction de dados antes de enviar
- [ ] CSP configurado
- [ ] Sanitização de dados da Binance
- [ ] Sem storage de dados sensíveis
- [ ] Validação de certificado do backend
- [ ] HTTPS obrigatório nas requisições
- [ ] Code signing da extensão

### Market Data Service
- [ ] Rate limiting respeitado (Binance)
- [ ] Backoff em caso de erro
- [ ] Validação de dados recebidos
- [ ] Cache seguro (sem dados sensíveis)

### AI Orchestrator
- [ ] Rate limiting por usuário
- [ ] Validação de inputs
- [ ] Sanitização de outputs
- [ ] Logs não expõem prompts completos (apenas hash)
- [ ] Rotação de API keys

### Infraestrutura
- [ ] Postgres com encryption at rest
- [ ] Redis com acesso restrito
- [ ] Backups criptografados
- [ ] Monitoramento de segurança (alertas)
- [ ] WAF (opcional, mas recomendado)

## Conformidade

### LGPD (Lei Geral de Proteção de Dados)
- ✅ Consentimento explícito para coleta de dados
- ✅ Direito ao esquecimento (deletar dados)
- ✅ Portabilidade de dados
- ✅ Retenção de dados: 90 dias (audit logs)
- ✅ Notificação de vazamento (se ocorrer)

### OWASP Top 10
- ✅ A01: Broken Access Control (RBAC)
- ✅ A02: Cryptographic Failures (encryption at rest)
- ✅ A03: Injection (sanitização)
- ✅ A04: Insecure Design (threat model)
- ✅ A05: Security Misconfiguration (CSP, CORS)
- ✅ A06: Vulnerable Components (dependências atualizadas)
- ✅ A07: Authentication Failures (JWT, rate limiting)
- ✅ A08: Software and Data Integrity (code signing)
- ✅ A09: Security Logging (audit log)
- ✅ A10: Server-Side Request Forgery (validação de URLs)

---

**Última atualização:** 2025-01-27  
**Versão:** Baseline 1.0
