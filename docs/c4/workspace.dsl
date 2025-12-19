workspace "DVAi$ - Mentor IA" "Sistema de mentoria financeira com IA" {

    model {
        # ============================================
        # CONTEXTO (C4 Level 1)
        # ============================================
        
        usuario = person "Usuário" "Investidor que utiliza o sistema para análise e mentoria financeira"
        
        sistema = softwareSystem "DVAi$ - Mentor IA" "Sistema de mentoria financeira com IA que ajuda investidores a tomar decisões inteligentes" {
            tags "Sistema"
        }
        
        corretoras = softwareSystem "Corretoras" "Plataformas de corretagem (ex: Binance, outras exchanges)" {
            tags "Externo"
        }
        
        provedoresIA = softwareSystem "Provedores de IA" "Serviços externos de IA para processamento avançado" {
            tags "Externo"
        }
        
        servicosExternos = softwareSystem "Serviços Externos" "Outros serviços externos (APIs, webhooks, etc.)" {
            tags "Externo"
        }
        
        # Relacionamentos de contexto
        usuario -> sistema "Utiliza para análise e mentoria"
        sistema -> corretoras "Obtém dados de mercado"
        sistema -> provedoresIA "Utiliza para processamento de IA"
        sistema -> servicosExternos "Integra com serviços externos"
        
        # ============================================
        # CONTAINERS (C4 Level 2)
        # ============================================
        
        browserExtension = container "Browser Extension" "Extensão Chrome com overlay na Binance - Interface principal do MVP" "Chrome Extension (Manifest V3)" {
            tags "Container"
            technology "Chrome Extension"
            
            # ============================================
            # COMPONENTES DA EXTENSÃO (C4 Level 3)
            # ============================================
            
            overlay = component "Overlay" "Interface sobreposta na Binance que aparece por clique - Exibe chat, mentoria e dados de mercado" "React, TypeScript" {
                tags "Component"
                technology "React"
            }
            
            dataCapture = component "Data Capture" "Captura contexto da página Binance (com redaction): símbolo, preço, timestamp" "DOM API, Content Script" {
                tags "Component"
                technology "Content Script"
            }
            
            extensionAuth = component "Autenticação" "Gerenciamento de autenticação da extensão - JWT tokens" "JWT, Chrome Storage" {
                tags "Component"
                technology "Auth"
            }
            
            # Relacionamentos de componentes da extensão
            overlay -> dataCapture "Solicita dados do contexto"
            overlay -> extensionAuth "Valida autenticação"
            overlay -> backendAPI "Envia requisições de mentoria"
            dataCapture -> extensionAuth "Usa token para requisições"
            dataCapture -> overlay "Fornece dados redacted"
        }
        
        painelWeb = container "Painel Web" "Aplicação Next.js 14 (App Router) - Landing page, login, chat/voz e alertas" "Next.js, React, TypeScript" {
            tags "Container"
            technology "Next.js 14"
            
            # ============================================
            # COMPONENTES DO PAINEL WEB (C4 Level 3)
            # ============================================
            
            rotasApp = component "Rotas App" "Rotas do Next.js App Router: /, /login, /cadastro, /analise-tempo-real" "Next.js App Router" {
                tags "Component"
                technology "Next.js"
            }
            
            componentes = component "Componentes React" "Componentes reutilizáveis da UI (componentes/): Header, Footer, Hero, Features, etc." "React, TypeScript" {
                tags "Component"
                technology "React"
            }
            
            biblioteca = component "Biblioteca" "Utilitários e funções auxiliares (biblioteca/)" "TypeScript" {
                tags "Component"
                technology "TypeScript"
            }
            
            auth = component "Autenticação" "Sistema de autenticação e validação (biblioteca/auth/): Login, Register, validações Zod" "Zod, JWT" {
                tags "Component"
                technology "Auth"
            }
            
            chatVoz = component "Chat/Voz" "Interface de chat e input de voz (speech-to-text) para interação com Mentor IA" "Web Speech API, React" {
                tags "Component"
                technology "React"
            }
            
            alertas = component "Alertas" "Configuração e gerenciamento de alertas WhatsApp" "React, WhatsApp API" {
                tags "Component"
                technology "React"
            }
            
            pwa = component "PWA" "Funcionalidades de Progressive Web App (service worker, cache)" "Workbox, Service Worker" {
                tags "Component"
                technology "PWA"
            }
            
            # Relacionamentos de componentes
            rotasApp -> componentes "Renderiza"
            rotasApp -> biblioteca "Utiliza utilitários"
            componentes -> biblioteca "Utiliza utilitários"
            componentes -> auth "Valida formulários"
            componentes -> chatVoz "Renderiza chat"
            componentes -> alertas "Renderiza alertas"
            componentes -> pwa "Registra service worker"
            biblioteca -> auth "Validações"
            chatVoz -> backendAPI "Envia mensagens"
            alertas -> backendAPI "Configura alertas"
        }
        
        backendAPI = container "Backend API" "API REST para processamento de dados e lógica de negócio: auth, regras, rate-limit, auditoria" "Node.js, Express/Fastify" {
            tags "Container"
            technology "Node.js"
            
            # ============================================
            # COMPONENTES DO BACKEND API (C4 Level 3)
            # ============================================
            
            authService = component "Auth Service" "Autenticação e autorização: JWT, refresh tokens, RBAC" "JWT, bcrypt" {
                tags "Component"
                technology "Node.js"
            }
            
            rateLimiter = component "Rate Limiter" "Rate limiting por IP e usuário usando Redis" "Redis, express-rate-limit" {
                tags "Component"
                technology "Node.js"
            }
            
            auditLogger = component "Audit Logger" "Registro de todas as ações para auditoria: logs estruturados em Postgres" "PostgreSQL, Winston" {
                tags "Component"
                technology "Node.js"
            }
            
            rulesEngine = component "Rules Engine" "Aplicação de regras de negócio e validações" "Node.js" {
                tags "Component"
                technology "Node.js"
            }
            
            # Relacionamentos de componentes do backend
            authService -> postgres "Valida usuários"
            rateLimiter -> redis "Contadores de rate limit"
            auditLogger -> postgres "Armazena logs"
            rulesEngine -> postgres "Consulta regras"
        }
        
        marketDataService = container "Market Data Service" "Serviço que conecta com Binance WebSocket: cache e normalização de dados" "Node.js, WebSocket" {
            tags "Container"
            technology "Node.js"
            
            # ============================================
            # COMPONENTES DO MARKET DATA SERVICE (C4 Level 3)
            # ============================================
            
            wsClient = component "WebSocket Client" "Cliente WebSocket para Binance: conexão, reconexão, heartbeat" "WebSocket, Node.js" {
                tags "Component"
                technology "Node.js"
            }
            
            normalizer = component "Normalizer" "Normalização de dados de mercado: formatação, validação, transformação" "Node.js" {
                tags "Component"
                technology "Node.js"
            }
            
            cacheManager = component "Cache Manager" "Gerenciamento de cache de dados de mercado no Redis" "Redis, Node.js" {
                tags "Component"
                technology "Node.js"
            }
            
            # Relacionamentos de componentes do market data
            wsClient -> corretoras "Conecta via WebSocket"
            wsClient -> normalizer "Envia dados brutos"
            normalizer -> cacheManager "Armazena dados normalizados"
            cacheManager -> redis "Cache de dados"
        }
        
        aiOrchestrator = container "AI Orchestrator" "Orquestra chamadas para provedores de IA: catálogo primeiro + chamada via API" "Node.js, Python (opcional)" {
            tags "Container"
            technology "Node.js"
            
            # ============================================
            # COMPONENTES DO AI ORCHESTRATOR (C4 Level 3)
            # ============================================
            
            catalog = component "AI Catalog" "Catálogo de provedores de IA disponíveis: OpenAI, Anthropic, etc." "Node.js" {
                tags "Component"
                technology "Node.js"
            }
            
            aiClient = component "AI Client" "Cliente para chamadas de API dos provedores de IA" "OpenAI SDK, Anthropic SDK" {
                tags "Component"
                technology "Node.js"
            }
            
            contextBuilder = component "Context Builder" "Constrói contexto para IA: histórico, dados de mercado, preferências" "Node.js" {
                tags "Component"
                technology "Node.js"
            }
            
            # Relacionamentos de componentes do AI Orchestrator
            catalog -> aiClient "Seleciona provedor"
            aiClient -> provedoresIA "Chama APIs de IA"
            contextBuilder -> postgres "Obtém histórico"
            contextBuilder -> redis "Obtém dados de mercado"
            aiClient -> contextBuilder "Usa contexto"
        }
        
        redis = container "Redis" "Cache de dados de mercado, respostas de IA e rate limiting counters" "Redis" {
            tags "Container" "Database"
            technology "Redis"
        }
        
        postgres = container "PostgreSQL" "Armazenamento de histórico de conversas, audit logs, configurações de usuário e alertas" "PostgreSQL" {
            tags "Container" "Database"
            technology "PostgreSQL"
        }
        
        vectorDB = container "Vector DB" "[FUTURO] Memória persistente avançada para contexto de conversas (opcional)" "Pinecone, Weaviate, PostgreSQL pgvector" {
            tags "Container" "Database" "Futuro"
            technology "Vector Database"
        }
        
        # Relacionamentos de containers
        usuario -> browserExtension "Usa extensão na Binance"
        usuario -> painelWeb "Acessa site (landing, login, chat, alertas)"
        browserExtension -> backendAPI "Faz requisições HTTPS (mentoria, dados)"
        browserExtension -> corretoras "Captura dados da página (redacted)"
        painelWeb -> backendAPI "Faz requisições HTTP (auth, chat, alertas)"
        backendAPI -> aiOrchestrator "Solicita processamento de IA"
        backendAPI -> redis "Cache e rate limiting"
        backendAPI -> postgres "Armazena histórico, logs e configurações"
        backendAPI -> marketDataService "Obtém dados de mercado"
        marketDataService -> corretoras "Conecta via WebSocket"
        marketDataService -> redis "Armazena cache de dados normalizados"
        aiOrchestrator -> provedoresIA "Chama APIs de IA"
        aiOrchestrator -> postgres "Armazena histórico de conversas"
        aiOrchestrator -> redis "Cache de respostas de IA"
        aiOrchestrator -> vectorDB "[FUTURO] Consulta memória persistente"
        
    }

    views {
        systemContext sistema "Contexto" {
            include *
            autolayout lr
        }
        
        container sistema "Containers" {
            include *
            autolayout lr
        }
        
        component painelWeb "Componentes do Painel Web" {
            include *
            autolayout tb
        }
        
        component browserExtension "Componentes da Browser Extension" {
            include *
            autolayout tb
        }
        
        styles {
            element "Sistema" {
                color #ffffff
                shape RoundedBox
            }
            element "Externo" {
                color #999999
                shape RoundedBox
            }
            element "Container" {
                color #438dd5
                shape RoundedBox
            }
            element "Futuro" {
                color #ffcccc
                shape RoundedBox
            }
            element "Component" {
                color #85bbf0
                shape RoundedBox
            }
        }
    }
    
}
