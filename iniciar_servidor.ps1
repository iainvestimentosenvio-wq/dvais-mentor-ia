# Script para iniciar o servidor do painel web
# Uso: .\iniciar_servidor.ps1

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  INICIANDO SERVIDOR DO PAINEL WEB" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$projectPath = Join-Path $PSScriptRoot "apps\painel-web"

if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Erro: Pasta do painel web não encontrada: $projectPath" -ForegroundColor Red
    exit 1
}

Write-Host "[1/4] Verificando se a porta 3000 está livre..." -ForegroundColor Cyan
$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    Write-Host "  ⚠️  Porta 3000 está ocupada!" -ForegroundColor Yellow
    Write-Host "  Tentando liberar a porta..." -ForegroundColor Yellow
    
    # Tentar matar processos na porta 3000
    $processes = netstat -ano | findstr :3000 | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $matches[1]
        }
    } | Select-Object -Unique
    
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  ✅ Processo $pid finalizado" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Não foi possível finalizar processo $pid" -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ✅ Porta 3000 está livre" -ForegroundColor Green
}
Write-Host ""

Write-Host "[2/4] Verificando dependências..." -ForegroundColor Cyan
$nodeModulesPath = Join-Path $projectPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "  ⚠️  node_modules não encontrado. Instalando dependências..." -ForegroundColor Yellow
    Set-Location $projectPath
    npm install
    Write-Host "  ✅ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "  ✅ Dependências encontradas" -ForegroundColor Green
}
Write-Host ""

Write-Host "[3/4] Limpando cache do Next.js (se necessário)..." -ForegroundColor Cyan
$nextPath = Join-Path $projectPath ".next"
if (Test-Path $nextPath) {
    $lastModified = (Get-Item $nextPath).LastWriteTime
    $daysSinceModified = (Get-Date) - $lastModified
    
    if ($daysSinceModified.Days -gt 7) {
        Write-Host "  Cache antigo detectado (última modificação: $($lastModified.ToString('dd/MM/yyyy')))" -ForegroundColor Yellow
        Write-Host "  Limpando cache..." -ForegroundColor Yellow
        Remove-Item -Path $nextPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Cache limpo" -ForegroundColor Green
    } else {
        Write-Host "  ✅ Cache está atualizado" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ️  Cache não existe (será criado na primeira execução)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "[4/4] Iniciando servidor..." -ForegroundColor Cyan
Set-Location $projectPath

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SERVIDOR INICIANDO..." -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Aguarde alguns segundos e acesse:" -ForegroundColor White
Write-Host "  🌐 Local:    http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  - Mantenha este terminal aberto enquanto o servidor estiver rodando" -ForegroundColor White
Write-Host "  - Para parar o servidor, pressione Ctrl + C" -ForegroundColor White
Write-Host ""

# Iniciar servidor
npm run dev
