---
name: Deploy Seguro Frontend Next.js
overview: Plano completo para hospedar o frontend Next.js em servidor gratuito (Vercel) de forma segura, protegendo o código fonte com repositório privado no GitHub, permitindo que colaboradores vejam e testem o site sem acesso ao código.
todos:
  - id: init-git
    content: Inicializar repositório Git local e fazer commit inicial com todos os arquivos do projeto
    status: pending
  - id: create-readme
    content: Criar ou atualizar README.md com informações básicas do projeto e instruções de uso
    status: pending
  - id: verify-gitignore
    content: Verificar se .gitignore está completo e correto (já está, mas confirmar)
    status: pending
  - id: wait-github-repo
    content: Aguardar usuário criar repositório privado no GitHub e fornecer URL
    status: pending
    dependencies:
      - init-git
  - id: connect-github
    content: Conectar repositório local ao GitHub remoto e fazer push do código
    status: pending
    dependencies:
      - wait-github-repo
  - id: wait-vercel-deploy
    content: Aguardar usuário fazer deploy na Vercel via interface web
    status: pending
    dependencies:
      - connect-github
  - id: update-urls
    content: Atualizar URLs no layout.tsx com domínio real da Vercel após deploy
    status: pending
    dependencies:
      - wait-vercel-deploy
  - id: test-deployment
    content: Verificar se site está funcionando corretamente e testar todas as páginas
    status: pending
    dependencies:
      - update-urls
---

# Deploy Seguro do Frontend Next.js - Plano Comp

leto

## Objetivo

Hospedar o frontend Next.js em servidor gratuito (Vercel) de forma segura, permitindo que colaboradores vejam e testem o site sem acesso ao código fonte.

## Por que Vercel?

**Vantagens:**

- ✅ Criada pelos desenvolvedores do Next.js (integração nativa perfeita)
- ✅ Plano gratuito generoso (100GB bandwidth/mês, deploys ilimitados)
- ✅ Deploy automático a cada push no GitHub
- ✅ SSL gratuito e CDN global (site rápido em qualquer lugar)
- ✅ Suporte completo a Next.js 14 (SSR, App Router, API Routes)
- ✅ Preview deployments (cada branch gera uma URL de teste)
- ✅ Zero configuração necessária (detecta Next.js automaticamente)

**Segurança:**

- ✅ Repositório pode ser **PRIVADO** no GitHub (código protegido)
- ✅ Site publicado não expõe código fonte (só bundle compilado)
- ✅ Headers de segurança já configurados no projeto funcionam automaticamente
- ✅ Controle de acesso por email (opcional, para limitar quem vê o site)

**Limitações do Plano Gratuito:**

- 100GB bandwidth/mês (suficiente para MVP/testes)
- 100 horas de função serverless/mês (não usado ainda, só frontend)
- Domínio personalizado gratuito (ex: `dvais-mentor-ia.vercel.app`)

## Comparação com Outras Opções

| Plataforma | Prós | Contras | Segurança ||------------|------|---------|-----------|| **Vercel** | Integração perfeita Next.js, deploy automático | - | ⭐⭐⭐⭐⭐ Repositório privado || **Netlify** | Similar ao Vercel | Configuração manual para Next.js | ⭐⭐⭐⭐⭐ Repositório privado || **GitHub Pages** | Gratuito | Não suporta SSR, só sites estáticos | ⭐⭐⭐ Repositório precisa ser público || **Railway/Render** | Suporta Next.js | Configuração mais complexa | ⭐⭐⭐⭐ Repositório privado |**Conclusão:** Vercel é a melhor opção para Next.js + segurança.

## Estrutura do Plano

### Fase 1: Preparação do Repositório Git (Posso fazer automaticamente)

1. Inicializar repositório Git no projeto
2. Criar commit inicial com todos os arquivos
3. Criar arquivo README.md básico (se não existir)

### Fase 2: Criar Repositório Privado no GitHub (Você faz manualmente)

1. Criar conta no GitHub (se não tiver)
2. Criar novo repositório **PRIVADO** chamado `dvais-mentor-ia`
3. Copiar URL do repositório

### Fase 3: Conectar ao GitHub (Posso fazer automaticamente)

1. Adicionar remote do GitHub ao Git local
2. Fazer push do código para o repositório privado

### Fase 4: Deploy na Vercel (Você faz manualmente - interface web)

1. Criar conta na Vercel (pode usar conta GitHub)
2. Conectar repositório GitHub à Vercel
3. Vercel detecta Next.js automaticamente
4. Configurar projeto (diretório: `apps/painel-web`)
5. Deploy automático acontece

### Fase 5: Configuração Pós-Deploy (Posso fazer automaticamente)

1. Atualizar URLs no `apps/painel-web/app/layout.tsx` com URL real da Vercel
2. Adicionar arquivo `vercel.json` se necessário (geralmente não precisa)
3. Testar site publicado

## Arquivos que Serão Modificados

### Arquivos Criados/Modificados:

- `.git/` (novo) - Repositório Git local
- `apps/painel-web/app/layout.tsx` - Atualizar URLs com domínio real da Vercel
- `README.md` (se não existir) - Documentação básica do projeto

### Arquivos que NÃO Serão Modificados:

- Código fonte do projeto (zero alterações)
- Configurações do Next.js (já está perfeito)
- `.gitignore` (já está configurado corretamente)

## Segurança - Como Proteger Sua Ideia

### 1. Repositório Privado no GitHub

- ✅ Código fonte fica **privado** (só você vê)
- ✅ Colaboradores podem ser adicionados depois (se quiser)
- ✅ Site publicado não expõe código fonte

### 2. O que Fica Público vs Privado

**Público (site publicado):**

- HTML/CSS/JS compilado (bundle minificado)
- Impossível extrair código fonte original
- Mesmo que alguém veja o bundle, não consegue entender a lógica completa

**Privado (repositório GitHub):**

- Todo código fonte TypeScript/React
- Estrutura do projeto
- Configurações e documentação

### 3. Proteções Adicionais (Opcional)

- **Password Protection:** Vercel permite proteger site com senha (útil para MVP)
- **Deploy apenas de branch específica:** Só `main` ou `production` faz deploy automático
- **Preview deployments:** Cada branch gera URL única (você controla quem vê)

## Passo a Passo Detalhado

### O que EU posso fazer automaticamente (sem risco):

1. **Inicializar Git local**
   ```bash
                     git init
                     git add .
                     git commit -m "Initial commit - MVP frontend"
   ```




2. **Criar README.md básico** (se não existir)

- Descrição do projeto
- Como rodar localmente
- Link para site publicado

3. **Preparar arquivos para deploy**

- Verificar se `.gitignore` está correto (já está)
- Verificar se `package.json` tem script `build` (já tem)

### O que VOCÊ precisa fazer manualmente:

1. **Criar conta no GitHub** (se não tiver)

- Acesse: https://github.com
- Crie conta gratuita

2. **Criar repositório privado**

- Clique em "New repository"
- Nome: `dvais-mentor-ia`
- **IMPORTANTE:** Marque como **Private** (não Public)
- NÃO inicialize com README (já vamos ter um)
- Copie a URL do repositório (ex: `https://github.com/seu-usuario/dvais-mentor-ia.git`)

3. **Conectar repositório local ao GitHub**

- Eu vou fazer isso depois que você me passar a URL

4. **Criar conta na Vercel**

- Acesse: https://vercel.com
- Clique em "Sign Up"
- Escolha "Continue with GitHub" (mais fácil)
- Autorize acesso ao GitHub

5. **Fazer deploy na Vercel**

- Clique em "Add New Project"
- Selecione o repositório `dvais-mentor-ia`
- Vercel detecta Next.js automaticamente
- **Configuração importante:**
    - Root Directory: `apps/painel-web` (porque é monorepo)
    - Framework Preset: Next.js (detectado automaticamente)
    - Build Command: `npm run build` (padrão)
    - Output Directory: `.next` (padrão)
- Clique em "Deploy"
- Aguarde 2-3 minutos (primeiro deploy é mais lento)
- Site estará em: `https://dvais-mentor-ia.vercel.app` (ou nome que você escolher)

6. **Compartilhar URL com colaboradores**

- Envie a URL do site publicado
- Eles podem ver e testar, mas **não têm acesso ao código**

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

**Mitigação:** Repositório privado no GitHub + site publicado não expõe código fonte

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

## Checklist Final

- [ ] Git inicializado localmente
- [ ] Repositório privado criado no GitHub
- [ ] Código enviado para GitHub
- [ ] Conta Vercel criada
- [ ] Projeto conectado na Vercel
- [ ] Deploy realizado com sucesso
- [ ] Site acessível publicamente
- [ ] URLs atualizadas no código
- [ ] Testado em diferentes dispositivos

## Próximos Passos Após Deploy

1. **Testar site publicado** em diferentes navegadores/dispositivos
2. **Compartilhar URL** com colaboradores para feedback
3. **Configurar domínio personalizado** (opcional, depois)
4. **Monitorar performance** usando ferramentas da Vercel
5. **Continuar desenvolvimento** normalmente (deploy automático)

## Perguntas Frequentes

**P: Posso mudar de plataforma depois?**R: Sim! O código não muda, só precisa fazer deploy em outra plataforma.**P: E se eu quiser adicionar colaboradores depois?**R: Pode adicionar no GitHub (acesso ao código) ou só compartilhar URL do site (só visualização).**P: Quanto tempo leva o deploy?**R: Primeiro deploy: 2-3 minutos. Deploys seguintes: 30-60 segundos.**P: Posso ter múltiplos ambientes?**R: Sim! Vercel cria URL para cada branch (ex: `feature-nova.vercel.app`).**P: E se eu quiser proteger o site com senha?**R: Sim! Vercel tem opção de "Password Protection" no plano gratuito.

## Conclusão

Este plano permite:

- ✅ Hospedar site gratuitamente