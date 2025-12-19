# MVP - Escopo e Funcionalidades

Este documento define o escopo do MVP (Minimum Viable Product) do DVAi$ Mentor IA, incluindo o que entra e o que não entra na primeira versão.

## O que ENTRA no MVP ✅

### 1. Mentor IA

**Funcionalidade**: Sistema de mentoria com IA que responde perguntas do usuário sobre investimentos.

**Características**:
- Chat via overlay na Binance
- Respostas contextualizadas com dados de mercado
- Suporte a múltiplos provedores de IA (OpenAI, Anthropic, etc.)
- Histórico de conversas (últimas 30 dias)

**Limitações MVP**:
- Máximo de 100 mensagens por usuário por dia
- Respostas em texto (sem voz no MVP)
- Sem memória persistente avançada (apenas histórico simples)

### 2. Overlay por Clique

**Funcionalidade**: Interface sobreposta (overlay) na página da Binance que aparece quando o usuário clica no botão da extensão.

**Características**:
- Overlay não invasivo (não cobre conteúdo importante)
- Aparece/desaparece por clique
- Responsivo e adaptável ao layout da Binance
- Suporte a temas (claro/escuro)

**Limitações MVP**:
- Apenas overlay (sem sidebar ou popup)
- Funciona apenas em `binance.com` (não em subdomínios específicos)
- Sem personalização avançada de posição/tamanho

### 3. WebSocket Market Data

**Funcionalidade**: Dados de mercado em tempo real via WebSocket da Binance.

**Características**:
- Preços em tempo real
- Indicadores técnicos básicos
- Suporte a múltiplos símbolos (até 10 simultâneos)
- Cache em Redis para reduzir carga

**Limitações MVP**:
- Apenas dados públicos (sem dados de conta)
- Máximo de 10 símbolos simultâneos por usuário
- Sem histórico de candles (apenas preço atual)

### 4. Chat/Voz (Básico)

**Funcionalidade**: Interface de chat para interagir com o Mentor IA.

**Características**:
- Chat em texto
- Input de voz (speech-to-text)
- Respostas em texto
- Histórico de conversa

**Limitações MVP**:
- Voz apenas para input (speech-to-text)
- Sem output de voz (text-to-speech)
- Sem suporte a múltiplos idiomas (apenas PT-BR)

### 5. Alertas WhatsApp

**Funcionalidade**: Envio de alertas via WhatsApp quando condições são atendidas.

**Características**:
- Alertas de preço (quando ativo atinge valor X)
- Alertas de indicadores técnicos
- Configuração de alertas no overlay
- Integração com WhatsApp Business API

**Limitações MVP**:
- Máximo de 5 alertas ativos por usuário
- Apenas alertas de preço e indicadores básicos
- Sem alertas complexos (combinações de condições)

## O que NÃO ENTRA no MVP ❌

### 1. Execução Automática de Ordens

**Decisão**: Não permitir que o sistema execute ordens automaticamente na Binance.

**Motivos**:
- Risco de segurança (credenciais, API keys)
- Responsabilidade legal
- Complexidade de implementação segura
- Não alinhado com o MVP (foco em mentoria, não execução)

**Alternativa MVP**:
- Usuário recebe recomendação
- Usuário executa ordem manualmente na Binance
- Sistema apenas fornece orientação

### 2. Saque pela Plataforma

**Decisão**: Não permitir saques ou transferências de fundos através da plataforma.

**Motivos**:
- Risco de segurança extremo
- Requer custódia de credenciais (viola princípio de segurança)
- Regulamentação complexa
- Não necessário para MVP (mentoria)

**Alternativa MVP**:
- Usuário faz saques diretamente na Binance
- Sistema apenas fornece orientação sobre quando/como fazer

### 3. Embed da Binance dentro do Site

**Decisão**: Não embutir a Binance via iframe no site do DVAi$ Mentor IA.

**Motivos**:
- Binance bloqueia iframes (X-Frame-Options)
- Risco de segurança (clickjacking)
- Experiência ruim (iframe limitado)
- Não necessário (extensão já funciona na Binance)

**Alternativa MVP**:
- Extensão funciona diretamente na Binance
- Site serve apenas para landing page e download da extensão

### 4. Múltiplas Corretoras

**Decisão**: MVP foca apenas na Binance.

**Motivos**:
- Reduz complexidade
- Binance é a maior exchange do mundo
- Permite validar o conceito antes de escalar

**Futuro**:
- Suporte a outras corretoras será adicionado após validação do MVP

### 5. Análise Técnica Avançada

**Decisão**: MVP não inclui análise técnica complexa ou backtesting.

**Motivos**:
- Complexidade de implementação
- Requer dados históricos extensos
- Pode ser adicionado após validação do MVP

**Alternativa MVP**:
- Indicadores técnicos básicos (RSI, MACD, etc.)
- Análise simples de tendência
- Recomendações baseadas em padrões básicos

### 6. Memória Persistente Avançada

**Decisão**: MVP não inclui memória de longo prazo ou contexto avançado.

**Motivos**:
- Complexidade de implementação
- Requer vector database
- Pode ser adicionado após validação do MVP

**Alternativa MVP**:
- Histórico simples de conversas (últimas 30 dias)
- Contexto da conversa atual
- Sem memória de longo prazo entre sessões

### 7. Dashboard Web Completo

**Decisão**: MVP não inclui dashboard web completo com todas as funcionalidades.

**Motivos**:
- Foco no overlay da extensão
- Reduz complexidade
- Site serve principalmente para landing page

**Alternativa MVP**:
- Landing page
- Página de download da extensão
- Página de configurações básicas (opcional)

## Priorização

### Fase 1 (MVP) - Essencial
1. ✅ Extensão com overlay na Binance
2. ✅ Chat com Mentor IA
3. ✅ Dados de mercado em tempo real
4. ✅ Alertas básicos via WhatsApp

### Fase 2 (Pós-MVP) - Importante
1. 🔜 Memória persistente avançada
2. 🔜 Análise técnica avançada
3. 🔜 Dashboard web completo
4. 🔜 Suporte a múltiplas corretoras

### Fase 3 (Futuro) - Desejável
1. 🔮 Execução automática de ordens (com segurança avançada)
2. 🔮 Text-to-speech (output de voz)
3. 🔮 Suporte a múltiplos idiomas
4. 🔮 Integração com outras plataformas (Telegram, etc.)

## Critérios de Sucesso do MVP

### Métricas de Adoção
- 1000+ usuários ativos em 3 meses
- 70%+ de retenção após 7 dias
- 50+ mensagens por usuário por semana

### Métricas de Qualidade
- Latência média de resposta < 2s
- Taxa de erro < 1%
- Satisfação do usuário > 4.0/5.0

### Métricas de Segurança
- Zero vazamentos de dados
- Zero incidentes de segurança
- 100% de conformidade com checklist de segurança

## Limitações Conhecidas do MVP

1. **Apenas Binance**: Não suporta outras corretoras
2. **Apenas PT-BR**: Interface e respostas apenas em português
3. **Sem execução de ordens**: Apenas mentoria, não execução
4. **Memória limitada**: Sem contexto avançado entre sessões
5. **Alertas básicos**: Apenas alertas simples de preço
6. **Sem voz output**: Apenas input de voz, não output

## Roadmap Pós-MVP

### Q2 2025
- Memória persistente avançada
- Análise técnica avançada
- Dashboard web completo

### Q3 2025
- Suporte a múltiplas corretoras
- Text-to-speech
- Suporte a múltiplos idiomas

### Q4 2025
- Execução automática de ordens (com segurança avançada)
- Integração com outras plataformas
- Features avançadas de análise

---

**Última atualização:** 2025-01-27  
**Versão:** MVP 1.0
