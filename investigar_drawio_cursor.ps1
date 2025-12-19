# Script para investigar problemas do Draw.io no Cursor
# Uso: .\investigar_drawio_cursor.ps1

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  INVESTIGAÇÃO: Draw.io no Cursor" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar extensão instalada
Write-Host "[1/6] Verificando extensão Draw.io..." -ForegroundColor Cyan
$extensionsPath = "$env:USERPROFILE\.cursor\extensions"
$drawioExtension = Get-ChildItem -Path $extensionsPath -Filter "*drawio*" -Directory -ErrorAction SilentlyContinue

if ($drawioExtension) {
    Write-Host "  ✅ Extensão encontrada:" -ForegroundColor Green
    $drawioExtension | ForEach-Object { 
        Write-Host "    - $($_.Name)" -ForegroundColor Gray
        Write-Host "      Localização: $($_.FullName)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ❌ Extensão Draw.io NÃO encontrada!" -ForegroundColor Red
    Write-Host "  💡 Instale: hediet.vscode-drawio" -ForegroundColor Yellow
}
Write-Host ""

# Verificar configurações
Write-Host "[2/6] Verificando configurações..." -ForegroundColor Cyan
$settingsPath = ".vscode\settings.json"
if (Test-Path $settingsPath) {
    $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
    Write-Host "  ✅ settings.json encontrado" -ForegroundColor Green
    
    if ($settings.'workbench.editorAssociations') {
        Write-Host "  ℹ️  Editor associations configurado:" -ForegroundColor Gray
        $settings.'workbench.editorAssociations'.PSObject.Properties | ForEach-Object {
            Write-Host "    $($_.Name) = $($_.Value)" -ForegroundColor Gray
        }
    }
    
    if ($settings.'drawio.theme') {
        Write-Host "  ℹ️  Draw.io theme: $($settings.'drawio.theme')" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠️  settings.json não encontrado" -ForegroundColor Yellow
}
Write-Host ""

# Verificar arquivo drawio
Write-Host "[3/6] Verificando arquivo .drawio..." -ForegroundColor Cyan
$drawioFile = "docs\diagramas\mapa-geral.drawio"
if (Test-Path $drawioFile) {
    $fileInfo = Get-Item $drawioFile
    Write-Host "  ✅ Arquivo encontrado: $drawioFile" -ForegroundColor Green
    Write-Host "  ℹ️  Tamanho: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
    Write-Host "  ℹ️  Última modificação: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
    
    # Verificar se é XML válido
    try {
        [xml]$null = Get-Content $drawioFile -Raw
        Write-Host "  ✅ Arquivo XML válido" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Arquivo XML inválido ou corrompido!" -ForegroundColor Red
    }
} else {
    Write-Host "  ❌ Arquivo não encontrado: $drawioFile" -ForegroundColor Red
}
Write-Host ""

# Verificar logs do Cursor
Write-Host "[4/6] Verificando logs do Cursor..." -ForegroundColor Cyan
$cursorLogsPath = "$env:APPDATA\Cursor\logs"
if (Test-Path $cursorLogsPath) {
    $latestLog = Get-ChildItem -Path $cursorLogsPath -Filter "*.log" -File | 
        Sort-Object LastWriteTime -Descending | 
        Select-Object -First 1
    
    if ($latestLog) {
        Write-Host "  ℹ️  Log mais recente: $($latestLog.Name)" -ForegroundColor Gray
        Write-Host "  ℹ️  Última modificação: $($latestLog.LastWriteTime)" -ForegroundColor Gray
        
        # Procurar erros relacionados ao Draw.io
        $drawioErrors = Select-String -Path $latestLog.FullName -Pattern "drawio|draw\.io|hediet" -ErrorAction SilentlyContinue
        if ($drawioErrors) {
            Write-Host "  ⚠️  Erros relacionados ao Draw.io encontrados:" -ForegroundColor Yellow
            $drawioErrors | Select-Object -First 5 | ForEach-Object {
                Write-Host "    $($_.Line)" -ForegroundColor Red
            }
        } else {
            Write-Host "  ✅ Nenhum erro relacionado ao Draw.io encontrado" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ⚠️  Pasta de logs não encontrada" -ForegroundColor Yellow
}
Write-Host ""

# Verificar versão do Cursor
Write-Host "[5/6] Verificando versão do Cursor..." -ForegroundColor Cyan
try {
    $cursorVersion = (Get-Item "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe" -ErrorAction SilentlyContinue).VersionInfo
    if ($cursorVersion) {
        Write-Host "  ℹ️  Versão do Cursor: $($cursorVersion.FileVersion)" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  Não foi possível detectar versão do Cursor" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠️  Não foi possível verificar versão do Cursor" -ForegroundColor Yellow
}
Write-Host ""

# Verificar problemas conhecidos
Write-Host "[6/6] Problemas conhecidos do Draw.io no Cursor..." -ForegroundColor Cyan
Write-Host "  ⚠️  Problemas conhecidos:" -ForegroundColor Yellow
Write-Host "    1. Extensão pode não funcionar corretamente no Cursor (bug conhecido)" -ForegroundColor White
Write-Host "    2. Arquivo pode abrir vazio ou sem ferramentas" -ForegroundColor White
Write-Host "    3. Interface pode não responder corretamente" -ForegroundColor White
Write-Host "    4. Pode haver conflito com outras extensões" -ForegroundColor White
Write-Host ""
Write-Host "  ✅ Soluções recomendadas:" -ForegroundColor Green
Write-Host "    1. Usar Draw.io Web (https://app.diagrams.net/)" -ForegroundColor White
Write-Host "    2. Sincronizar arquivos do Google Drive para pasta local" -ForegroundColor White
Write-Host "    3. Usar app desktop do Draw.io" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  INVESTIGAÇÃO CONCLUÍDA" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Para sincronizar arquivos do Google Drive:" -ForegroundColor White
Write-Host "   - Baixe o arquivo do Google Drive" -ForegroundColor Gray
Write-Host "   - Salve em: docs\diagramas\" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Para usar Draw.io Web:" -ForegroundColor White
Write-Host "   - Acesse: https://app.diagrams.net/" -ForegroundColor Gray
Write-Host "   - Abra arquivo do Google Drive OU arquivo local" -ForegroundColor Gray
Write-Host "   - Salve no Google Drive OU baixe para local" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Para configurar sincronização automática:" -ForegroundColor White
Write-Host "   - Use Google Drive Desktop App" -ForegroundColor Gray
Write-Host "   - Configure pasta docs\diagramas\ como sincronizada" -ForegroundColor Gray
Write-Host ""






