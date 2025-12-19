# Deploy Seguro do Frontend Next.js - Plano Revisado

## Objetivo

Hospedar o frontend Next.js na Vercel (plano Hobby/gratuito) de forma segura, com automação máxima via CLI, protegendo o código fonte com repositório privado no GitHub.

## Correções Aplicadas

### 1. Password Protection (CORRIGIDO)

**❌ ERRADO (plano anterior):**

- "Password Protection no plano gratuito"

**✅ CORRETO:**

- **Password Protection é Enterprise ou add-on Pro** (não disponível no plano gratuito)
- **Alternativas no plano gratuito:**
- **Vercel Authentication** (disponível em todos os planos) - protege preview deployments e/ou production
- **Shareable Links** (quando aplicável) - links temporários para previews
- **Basic Auth via Next.js Middleware** (com ENV) - se quiser compartilhar com pessoas sem conta Vercel

### 2. Segurança do Bundle (CORRIGIDO)

**❌ ERRADO (plano anterior):**

- "Site publicado não expõe código fonte"
- "Impossível extrair código fonte original"

**✅ CORRETO:**

- **Bundle compilado é público e inspecionável** (qualquer um pode ver o JavaScript minificado no navegador)
- **Segurança real vem de:**
- Repositório privado no GitHub (código fonte protegido)
- **NÃO colocar segredos no frontend** (API keys, tokens, senhas)
- Usar variáveis de ambiente apenas para valores públicos (NEXT_PUBLIC_*)
- Lógica sensível deve estar no backend (nunca no frontend)

### 3. URLs Hardcoded (CORRIGIDO)

**❌ ERRADO (plano anterior):**

- Hardcode de URL da Vercel em `layout.tsx`

**✅ CORRETO:**

- Usar variável de ambiente `NEXT_PUBLIC_SITE_URL`
- Configurar `metadataBase` do Next.js dinamicamente
- Funciona em local/preview/prod automaticamente

## Por que Vercel?

**Vantagens:**

- ✅ Criada pelos desenvolvedores do Next.js (integração nativa perfeita)
- ✅ Plano Hobby gratuito generoso (100GB bandwidth/mês, deploys ilimitados)
- ✅ Deploy automático a cada push no GitHub
- ✅ SSL gratuito e CDN global (site rápido em qualquer lugar)
- ✅ Suporte completo a Next.js 14 (SSR, App Router, API Routes)
- ✅ Preview deployments (cada branch gera uma URL de teste)
- ✅ Zero configuração necessária (detecta Next.js automaticamente)

**Segurança:**

- ✅ Repositório pode ser **PRIVADO** no GitHub (código protegido)
- ✅ Headers de segurança já configurados no projeto funcionam automaticamente
- ✅ Variáveis de ambiente seguras (não expostas no bundle)

**Limitações do Plano Hobby (Gratuito):**

- 100GB bandwidth/mês (suficiente para MVP/testes)
- 100 horas de função serverless/mês (não usado ainda, só frontend)
- Domínio personalizado gratuito (ex: `dvais-mentor-ia.vercel.app`)
- **Password Protection NÃO disponível** (só Enterprise/Pro)

## Estrutura do Plano Revisado

### Fase 1: Auditoria de Segurança (Automático)

1. Verificar `.gitignore` inclui `.env*` e `.env.local`
2. Remover `console.log` sensíveis (se houver)
3. Confirmar que não há credenciais hardcoded

### Fase 2: Configuração de ENV (Automático)

1. Atualizar `layout.tsx` para usar `NEXT_PUBLIC_SITE_URL`
2. Configurar `metadataBase` dinamicamente
3. Criar `.env.example` com variáveis necessárias

### Fase 3: Preparação Git (Automático via Script)

1. Inicializar repositório Git no projeto
2. Criar commit inicial com todos os arquivos
3. Verificar `.gitignore` está correto

### Fase 4: Repositório GitHub (Semi-Automático)

**Opção A - Automático (se GitHub CLI instalado):**

- Script cria repositório privado via `gh repo create`
- Faz push automático

**Opção B - Manual Mínimo (se GitHub CLI não disponível):**

- Criar repositório privado no GitHub (1 clique)
- Script faz o resto (conectar e push)

### Fase 5: Deploy Vercel (Semi-Automático)

**Opção A - Automático (se Vercel CLI instalado):**

- Script faz `vercel link` e `vercel --prod`
- Configura root directory: `apps/painel-web`

**Opção B - Manual Mínimo (se Vercel CLI não disponível):**

- Conectar repositório GitHub à Vercel (1 clique no dashboard)
- Configurar Root Directory: `apps/painel-web`
- Deploy automático acontece

### Fase 6: Configuração Pós-Deploy (Automático)

1. Configurar `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente da Vercel
2. Testar site publicado

## Arquivos que Serão Criados/Modificados

### Arquivos Criados:

- `scripts/setup_deploy.ps1` - Script PowerShell de automação
- `.env.example` - Template de variáveis de ambiente
- `apps/painel-web/vercel.json` - Configuração do monorepo (se necessário)

### Arquivos Modificados:

- `apps/painel-web/app/layout.tsx` - Usar `NEXT_PUBLIC_SITE_URL` via ENV
- `.gitignore` - Verificar/atualizar se necessário

### Arquivos que NÃO Serão Modificados:

- Código fonte do projeto (zero alterações funcionais)
- Configurações do Next.js (já está perfeito)

## Segurança - Como Proteger Sua Ideia

### 1. Repositório Privado no GitHub

- ✅ Código fonte fica **privado** (só você vê)
- ✅ Colaboradores podem ser adicionados depois (se quiser)
- ✅ Site publicado não expõe código fonte original

### 2. O que Fica Público vs Privado

**Público (site publicado - bundle compilado):**

- HTML/CSS/JS compilado e minificado
- **É inspecionável** (qualquer um pode ver no DevTools)
- **NÃO contém código fonte original** (apenas bundle otimizado)
- **NÃO deve conter segredos** (API keys, tokens, senhas)

**Privado (repositório GitHub):**

- Todo código fonte TypeScript/React
- Estrutura do projeto
- Configurações e documentação
- Variáveis de ambiente (`.env.local`)

### 3. Proteções Adicionais (Opcional)

**No Plano Gratuito:**

- **Vercel Authentication** - protege preview deployments (requer login Vercel)
- **Shareable Links** - links temporários para previews
- **Basic Auth via Next.js Middleware** - se quiser compartilhar com pessoas sem conta Vercel (implementação custom)

**Não Disponível no Gratuito:**

- ❌ Password Protection (só Enterprise/Pro)

## Automação Máxima - Script PowerShell

O script `scripts/setup_deploy.ps1` automatiza:

1. ✅ Inicialização Git
2. ✅ Commit inicial
3. ✅ Criação de repositório GitHub (se `gh` CLI disponível)
4. ✅ Push para GitHub
5. ✅ Deploy na Vercel (se `vercel` CLI disponível)
6. ✅ Configuração de variáveis de ambiente

**Dependências opcionais:**

- `gh` (GitHub CLI) - para criar repo automaticamente
- `vercel` (Vercel CLI) - para deploy automático

**Se não tiver:**

- Script fornece instruções exatas do que fazer manualmente (mínimo necessário)

## Checklist de Segurança Pré-Deploy

- [ ] `.env*` está no `.gitignore`
- [ ] Não há `console.log` com dados sensíveis (email, senha, tokens)
- [ ] Não há credenciais hardcoded no código
- [ ] `NEXT_PUBLIC_*` variáveis são apenas valores públicos
- [ ] Headers de segurança estão configurados (já está)
- [ ] CSP está configurado (já está)

## Passo a Passo Detalhado

### O que o SCRIPT faz automaticamente:

1. **Inicializar Git local**
   ````powershell
         git init
         git add .
         git commit -m "Initial commit - MVP frontend"
         ```
      
                            2. **Verificar .gitignore**
                                            - Confirma que `.env*` está ignorado
      
                            3. **Criar repositório GitHub (se `gh` disponível)**
         ```powershell
         gh repo create dvais-mentor-ia --private --source=. --remote=origin
         git push -u origin main
         ```
      
                            4. **Deploy Vercel (se `vercel` CLI disponível)**
         ```powershell
         cd apps/painel-web
         vercel link
         vercel --prod
         ```
      
      ### O que VOCÊ precisa fazer (mínimo manual):
      
      **Se GitHub CLI NÃO estiver instalado:**
                            1. Criar repositório privado no GitHub (1 clique)
                                            - Nome: `dvais-mentor-ia`
                                            - Privado: ✅
                                            - NÃO inicializar com README
                            2. Copiar URL do repositório
                            3. Script faz o resto (conectar e push)
      
      **Se Vercel CLI NÃO estiver instalado:**
                            1. Criar conta na Vercel (https://vercel.com)
                            2. Conectar repositório GitHub (1 clique)
                            3. Configurar Root Directory: `apps/painel-web`
                            4. Deploy automático acontece
      
      **Após deploy:**
                            1. Configurar `NEXT_PUBLIC_SITE_URL` nas variáveis de ambiente da Vercel
                                            - Dashboard Vercel → Settings → Environment Variables
                                            - Adicionar: `NEXT_PUBLIC_SITE_URL` = `https://seu-projeto.vercel.app`
      
      ## Fluxo de Trabalho Futuro
      
      ```javascript
      Você faz alteração no código
          ↓
      git add .
      git commit -m "Descrição da mudança"
      git push origin main
          ↓
      Vercel detecta push automaticamente
          ↓
      Deploy automático (2-3 minutos)
          ↓
      Site atualizado automaticamente
          ↓
      Colaboradores veem mudanças instantaneamente
      ```
      
      ## Riscos e Mitigações
      
      ### Risco 1: Código exposto
      
      **Mitigação:** 
                            - Repositório privado no GitHub
                            - Bundle compilado não expõe código fonte original
                            - **NÃO colocar segredos no frontend**
      
      ### Risco 2: Deploy quebrar algo
      
      **Mitigação:**
                            - Preview deployments (testa antes de publicar)
                            - Rollback instantâneo na Vercel (1 clique)
                            - Código local sempre funciona (não depende do deploy)
      
      ### Risco 3: Perder código
      
      **Mitigação:**
                            - Git local + GitHub (backup duplo)
                            - Vercel mantém histórico de deploys
      
      ### Risco 4: Limite do plano gratuito
      
      **Mitigação:**
                            - 100GB/mês é muito para MVP/testes
                            - Se precisar mais, pode migrar depois (código não muda)
      
      ### Risco 5: Segredos no frontend
      
      **Mitigação:**
                            - Usar apenas `NEXT_PUBLIC_*` para valores públicos
                            - Lógica sensível sempre no backend
                            - Verificar bundle compilado não contém segredos
      
      ## Checklist Final
      
                            - [ ] Git inicializado localmente
                            - [ ] `.env*` no `.gitignore`
                            - [ ] `console.log` sensíveis removidos
                            - [ ] `layout.tsx` usa `NEXT_PUBLIC_SITE_URL`
                            - [ ] Repositório privado criado no GitHub
                            - [ ] Código enviado para GitHub
                            - [ ] Conta Vercel criada
                            - [ ] Projeto conectado na Vercel
                            - [ ] Root Directory configurado: `apps/painel-web`
                            - [ ] Deploy realizado com sucesso
                            - [ ] `NEXT_PUBLIC_SITE_URL` configurado na Vercel
                            - [ ] Site acessível publicamente
                            - [ ] Testado em diferentes dispositivos
      
      ## Próximos Passos Após Deploy
      
                            1. **Testar site publicado** em diferentes navegadores/dispositivos
                            2. **Compartilhar URL** com colaboradores para feedback
                            3. **Configurar domínio personalizado** (opcional, depois)
                            4. **Monitorar performance** usando ferramentas da Vercel
                            5. **Continuar desenvolvimento** normalmente (deploy automático)
      
      ## Perguntas Frequentes
      
      **P: Posso mudar de plataforma depois?**
      R: Sim! O código não muda, só precisa fazer deploy em outra plataforma.
      
      **P: E se eu quiser adicionar colaboradores depois?**
      R: Pode adicionar no GitHub (acesso ao código) ou só compartilhar URL do site (só visualização).
      
      **P: Quanto tempo leva o deploy?**
      R: Primeiro deploy: 2-3 minutos. Deploys seguintes: 30-60 segundos.
      
      **P: Posso ter múltiplos ambientes?**
      R: Sim! Vercel cria URL para cada branch (ex: `feature-nova.vercel.app`).
      
      **P: E se eu quiser proteger o site com senha?**
      R: No plano gratuito, use Vercel Authentication (preview deployments) ou implemente Basic Auth via Next.js Middleware.
      
      **P: O bundle compilado é seguro?**
      R: O bundle é público e inspecionável. A segurança vem do repositório privado e de não colocar segredos no frontend.
      
      ## Conclusão
      
      Este plano revisado permite:
      
                            - ✅ Hospedar site gratuitamente
                            - ✅ Proteger código fonte (repositório privado)
                            - ✅ Deploy automático a cada mudança
                            - ✅ Compartilhar site sem expor código
                            - ✅ Automação máxima via CLI
      
   
   ````