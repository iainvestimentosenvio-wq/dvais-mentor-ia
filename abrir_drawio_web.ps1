# Script para abrir arquivo DrawIO na versão web (mais confiável)
# Este script abre o arquivo diretamente no navegador usando o DrawIO web

$drawioFile = "docs\diagramas\mapa-geral.drawio"
$fullPath = Join-Path $PSScriptRoot $drawioFile

if (Test-Path $fullPath) {
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  Abrindo DrawIO na versão Web (mais confiável)" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Arquivo: $fullPath" -ForegroundColor White
    Write-Host ""
    Write-Host "O navegador vai abrir com o DrawIO web." -ForegroundColor Yellow
    Write-Host "Você pode editar normalmente e salvar com Ctrl+S" -ForegroundColor Yellow
    Write-Host ""
    
    # Abrir DrawIO web com o arquivo
    $url = "https://app.diagrams.net/?mode=file&file=$([System.Uri]::EscapeDataString($fullPath))"
    Start-Process $url
} else {
    Write-Host "ERRO: Arquivo não encontrado: $fullPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique se o arquivo existe no caminho correto." -ForegroundColor Yellow
}









