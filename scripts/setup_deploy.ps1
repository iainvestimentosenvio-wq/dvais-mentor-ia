# Script de Automação para Deploy Seguro na Vercel
# DVAi$ - Mentor IA
# 
# Este script automatiza:
# 1. Inicialização Git
# 2. Commit inicial
# 3. Criação de repositório GitHub (se GitHub CLI disponível)
# 4. Push para GitHub
# 5. Deploy na Vercel (se Vercel CLI disponível)
#
# Dependências opcionais:
# - gh (GitHub CLI) - para criar repo automaticamente
# - vercel (Vercel CLI) - para deploy automático
#
# Se não tiver, o script fornece instruções exatas do que fazer manualmente.

param(
    [string]$RepoName = "dvais-mentor-ia",
    [string]$BranchName = "main"
)

$ErrorActionPreference = "Stop"
$script:HasGitHubCLI = $false
$script:HasVercelCLI = $false

# Cores para output
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n🔹 $Message" -ForegroundColor Magenta
}

# Verificar dependências
function Test-Dependencies {
    Write-Step "Verificando dependências..."
    
    # Verificar Git
    try {
        $gitVersion = git --version
        Write-Success "Git encontrado: $gitVersion"
    } catch {
        Write-Error "Git não encontrado. Instale Git primeiro: https://git-scm.com/download/win"
        exit 1
    }
    
    # Verificar GitHub CLI
    try {
        $ghVersion = gh --version 2>&1 | Select-Object -First 1
        Write-Success "GitHub CLI encontrado: $ghVersion"
        $script:HasGitHubCLI = $true
    } catch {
        Write-Warning "GitHub CLI não encontrado. Você precisará criar o repositório manualmente."
        Write-Info "Instale: winget install --id GitHub.cli"
    }
    
    # Verificar Vercel CLI
    try {
        $vercelVersion = vercel --version
        Write-Success "Vercel CLI encontrado: $vercelVersion"
        $script:HasVercelCLI = $true
    } catch {
        Write-Warning "Vercel CLI não encontrado. Você precisará fazer deploy manualmente."
        Write-Info "Instale: npm i -g vercel"
    }
}

# Inicializar Git
function Initialize-Git {
    Write-Step "Inicializando repositório Git..."
    
    if (Test-Path ".git") {
        Write-Warning "Repositório Git já existe. Pulando inicialização."
        return
    }
    
    git init
    git branch -M $BranchName
    Write-Success "Repositório Git inicializado"
}

# Verificar .gitignore
function Test-GitIgnore {
    Write-Step "Verificando .gitignore..."
    
    $gitignorePath = ".gitignore"
    if (-not (Test-Path $gitignorePath)) {
        Write-Error ".gitignore não encontrado!"
        exit 1
    }
    
    $gitignoreContent = Get-Content $gitignorePath -Raw
    
    if ($gitignoreContent -match "\.env") {
        Write-Success ".gitignore contém .env* (seguro)"
    } else {
        Write-Warning ".gitignore pode não estar ignorando .env*"
        Write-Info "Adicione estas linhas ao .gitignore:"
        Write-Host "  **/.env*.local" -ForegroundColor Yellow
        Write-Host "  **/.env.local" -ForegroundColor Yellow
    }
}

# Fazer commit inicial
function New-InitialCommit {
    Write-Step "Fazendo commit inicial..."
    
    git add .
    $commitMessage = "Initial commit - MVP frontend"
    git commit -m $commitMessage
    
    Write-Success "Commit inicial criado: $commitMessage"
}

# Criar repositório GitHub (se CLI disponível)
function New-GitHubRepo {
    if (-not $script:HasGitHubCLI) {
        Write-Step "GitHub CLI não disponível - pulando criação automática"
        Write-ManualGitHubInstructions
        return $false
    }
    
    Write-Step "Criando repositório privado no GitHub..."
    
    # Verificar se já está logado
    try {
        gh auth status 2>&1 | Out-Null
    } catch {
        Write-Warning "GitHub CLI não está autenticado."
        Write-Info "Execute: gh auth login"
        Write-ManualGitHubInstructions
        return $false
    }
    
    try {
        gh repo create $RepoName --private --source=. --remote=origin --push
        Write-Success "Repositório GitHub criado e código enviado!"
        return $true
    } catch {
        Write-Error "Erro ao criar repositório GitHub: $_"
        Write-ManualGitHubInstructions
        return $false
    }
}

# Instruções manuais para GitHub
function Write-ManualGitHubInstructions {
    Write-Host "`n📋 INSTRUÇÕES MANUAIS - GitHub:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://github.com/new" -ForegroundColor White
    Write-Host "2. Nome do repositório: $RepoName" -ForegroundColor White
    Write-Host "3. Marque como PRIVADO (não Public)" -ForegroundColor White
    Write-Host "4. NÃO inicialize com README" -ForegroundColor White
    Write-Host "5. Clique em 'Create repository'" -ForegroundColor White
    Write-Host "6. Copie a URL do repositório (ex: https://github.com/seu-usuario/$RepoName.git)" -ForegroundColor White
    Write-Host "`nDepois, execute estes comandos:" -ForegroundColor Cyan
    Write-Host "  git remote add origin <URL_DO_REPOSITORIO>" -ForegroundColor Green
    Write-Host "  git push -u origin $BranchName" -ForegroundColor Green
}

# Deploy Vercel (se CLI disponível)
function Start-VercelDeploy {
    if (-not $script:HasVercelCLI) {
        Write-Step "Vercel CLI não disponível - pulando deploy automático"
        Write-ManualVercelInstructions
        return
    }
    
    Write-Step "Fazendo deploy na Vercel..."
    
    $painelWebPath = "apps/painel-web"
    if (-not (Test-Path $painelWebPath)) {
        Write-Error "Diretório $painelWebPath não encontrado!"
        Write-ManualVercelInstructions
        return
    }
    
    Push-Location $painelWebPath
    
    try {
        # Verificar se já está linkado
        if (-not (Test-Path ".vercel")) {
            Write-Info "Linkando projeto à Vercel..."
            vercel link --yes
        }
        
        Write-Info "Fazendo deploy de produção..."
        vercel --prod --yes
        
        Write-Success "Deploy na Vercel concluído!"
        Write-Info "Configure NEXT_PUBLIC_SITE_URL nas variáveis de ambiente da Vercel"
    } catch {
        Write-Error "Erro ao fazer deploy na Vercel: $_"
        Write-ManualVercelInstructions
    } finally {
        Pop-Location
    }
}

# Instruções manuais para Vercel
function Write-ManualVercelInstructions {
    Write-Host "`n📋 INSTRUÇÕES MANUAIS - Vercel:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://vercel.com" -ForegroundColor White
    Write-Host "2. Faça login (pode usar conta GitHub)" -ForegroundColor White
    Write-Host "3. Clique em 'Add New Project'" -ForegroundColor White
    Write-Host "4. Selecione o repositório: $RepoName" -ForegroundColor White
    Write-Host "5. Configure:" -ForegroundColor White
    Write-Host "   - Root Directory: apps/painel-web" -ForegroundColor Cyan
    Write-Host "   - Framework Preset: Next.js (detectado automaticamente)" -ForegroundColor Cyan
    Write-Host "   - Build Command: npm run build (padrão)" -ForegroundColor Cyan
    Write-Host "6. Clique em 'Deploy'" -ForegroundColor White
    Write-Host "7. Aguarde 2-3 minutos" -ForegroundColor White
    Write-Host "8. Configure NEXT_PUBLIC_SITE_URL nas variáveis de ambiente:" -ForegroundColor White
    Write-Host "   - Dashboard Vercel → Settings → Environment Variables" -ForegroundColor Cyan
    Write-Host "   - Adicione: NEXT_PUBLIC_SITE_URL = https://seu-projeto.vercel.app" -ForegroundColor Cyan
}

# Main
function Main {
    Write-Host "`n🚀 Script de Deploy Seguro - DVAi$ Mentor IA" -ForegroundColor Magenta
    Write-Host "=" * 60 -ForegroundColor Gray
    
    Test-Dependencies
    Initialize-Git
    Test-GitIgnore
    New-InitialCommit
    
    $repoCreated = New-GitHubRepo
    
    if ($repoCreated) {
        Start-VercelDeploy
    } else {
        Write-Host "`n⏸️  Aguardando criação manual do repositório GitHub..." -ForegroundColor Yellow
        Write-Host "Após criar e fazer push, execute novamente este script para deploy na Vercel" -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ Processo concluído!" -ForegroundColor Green
    Write-Host "`n📝 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Configure NEXT_PUBLIC_SITE_URL na Vercel (se ainda não fez)" -ForegroundColor White
    Write-Host "2. Teste o site publicado" -ForegroundColor White
    Write-Host "3. Compartilhe URL com colaboradores" -ForegroundColor White
}

# Executar
Main


