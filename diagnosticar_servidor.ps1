# Script para diagnosticar por que o servidor parou
# Uso: .\diagnosticar_servidor.ps1

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  DIAGNÓSTICO: Por Que o Servidor Parou" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$projectPath = Join-Path $PSScriptRoot "apps\painel-web"

Write-Host "[1/5] Verificando porta 3000..." -ForegroundColor Cyan
$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    Write-Host "  ✅ Porta 3000 está em uso" -ForegroundColor Green
    $portCheck | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
} else {
    Write-Host "  ❌ Porta 3000 está livre (servidor não está rodando)" -ForegroundColor Red
}
Write-Host ""

Write-Host "[2/5] Verificando processos Node.js..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $count = ($nodeProcesses | Measure-Object).Count
    Write-Host "  ⚠️  Encontrados $count processos Node.js rodando" -ForegroundColor Yellow
    $nodeProcesses | Select-Object Id, StartTime, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet64/1MB,2)}} | Format-Table
    Write-Host "  💡 Estes processos podem estar ocupando recursos" -ForegroundColor Gray
} else {
    Write-Host "  ✅ Nenhum processo Node.js encontrado" -ForegroundColor Green
}
Write-Host ""

Write-Host "[3/5] Verificando arquivos do projeto..." -ForegroundColor Cyan
if (-not (Test-Path $projectPath)) {
    Write-Host "  ❌ Pasta do projeto não encontrada!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Pasta do projeto encontrada" -ForegroundColor Green

$packageJson = Join-Path $projectPath "package.json"
if (-not (Test-Path $packageJson)) {
    Write-Host "  ❌ package.json não encontrado!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ package.json encontrado" -ForegroundColor Green

$nodeModules = Join-Path $projectPath "node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "  ⚠️  node_modules não encontrado (dependências não instaladas)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ node_modules encontrado" -ForegroundColor Green
}
Write-Host ""

Write-Host "[4/5] Verificando cache do Next.js..." -ForegroundColor Cyan
$nextPath = Join-Path $projectPath ".next"
if (Test-Path $nextPath) {
    $lastModified = (Get-Item $nextPath).LastWriteTime
    $size = [math]::Round((Get-ChildItem $nextPath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
    Write-Host "  ℹ️  Cache existe (última modificação: $($lastModified.ToString('dd/MM/yyyy HH:mm')))" -ForegroundColor Gray
    Write-Host "  ℹ️  Tamanho: $size MB" -ForegroundColor Gray
    
    # Verificar se cache pode estar corrompido
    $errorFiles = Get-ChildItem $nextPath -Filter "*error*" -Recurse -ErrorAction SilentlyContinue
    if ($errorFiles) {
        Write-Host "  ⚠️  Arquivos de erro encontrados no cache!" -ForegroundColor Yellow
        Write-Host "  💡 Recomendado: Limpar cache (.next)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ️  Cache não existe (será criado na primeira execução)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "[5/5] Tentando iniciar servidor para ver erros..." -ForegroundColor Cyan
Write-Host "  Executando: npm run dev (primeiros 20 segundos)" -ForegroundColor Gray
Write-Host ""

Set-Location $projectPath

# Tentar iniciar e capturar erros iniciais
$job = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm run dev 2>&1
} -ArgumentList $projectPath

Start-Sleep -Seconds 5

$output = Receive-Job -Job $job
Stop-Job -Job $job
Remove-Job -Job $job

if ($output) {
    $errorLines = $output | Where-Object { $_ -match "error|Error|ERROR|failed|Failed|FAILED" }
    if ($errorLines) {
        Write-Host "  ❌ ERROS ENCONTRADOS:" -ForegroundColor Red
        $errorLines | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    } else {
        Write-Host "  ✅ Nenhum erro inicial detectado" -ForegroundColor Green
        Write-Host "  ℹ️  Primeiras linhas de saída:" -ForegroundColor Gray
        $output | Select-Object -First 5 | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
    }
} else {
    Write-Host "  ⚠️  Nenhuma saída capturada" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  DIAGNÓSTICO CONCLUÍDO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "POSSÍVEIS CAUSAS DO SERVIDOR TER PARADO:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Erro de compilação (verifique erros acima)" -ForegroundColor White
Write-Host "2. Terminal foi fechado (servidor para quando terminal fecha)" -ForegroundColor White
Write-Host "3. Processo foi encerrado manualmente" -ForegroundColor White
Write-Host "4. Cache corrompido (limpe .next)" -ForegroundColor White
Write-Host "5. Memória insuficiente" -ForegroundColor White
Write-Host "6. Erro no código após mudanças recentes" -ForegroundColor White
Write-Host ""
Write-Host "SOLUÇÕES RECOMENDADAS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Limpar cache e reiniciar:" -ForegroundColor White
Write-Host "   cd apps/painel-web" -ForegroundColor Gray
Write-Host "   Remove-Item -Recurse -Force .next" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Usar script automático:" -ForegroundColor White
Write-Host "   .\iniciar_servidor.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verificar erros no código:" -ForegroundColor White
Write-Host "   - Olhe o terminal onde o servidor estava rodando" -ForegroundColor Gray
Write-Host "   - Procure por mensagens de erro" -ForegroundColor Gray
Write-Host ""
