# Script para sincronizar arquivos Draw.io do Google Drive
# Uso: .\sincronizar_google_drive.ps1

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  SINCRONIZAÇÃO: Google Drive → Projeto Local" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$projectPath = Join-Path $PSScriptRoot "docs\diagramas"
$targetFile = Join-Path $projectPath "mapa-geral.drawio"

Write-Host "INSTRUÇÕES PARA SINCRONIZAR:" -ForegroundColor Yellow
Write-Host ""

Write-Host "MÉTODO 1: Baixar Manualmente do Google Drive" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abra Google Drive no navegador:" -ForegroundColor White
Write-Host "   https://drive.google.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Localize o arquivo .drawio que você salvou" -ForegroundColor White
Write-Host ""
Write-Host "3. Clique com botão direito no arquivo" -ForegroundColor White
Write-Host "   → Escolha 'Download' ou 'Baixar'" -ForegroundColor White
Write-Host ""
Write-Host "4. O arquivo será baixado para sua pasta Downloads" -ForegroundColor White
Write-Host ""
Write-Host "5. Copie o arquivo para o projeto:" -ForegroundColor White
Write-Host "   - Origem: $env:USERPROFILE\Downloads\mapa-geral.drawio" -ForegroundColor Gray
Write-Host "   - Destino: $targetFile" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Execute este comando no PowerShell:" -ForegroundColor Yellow
Write-Host "   Copy-Item `"$env:USERPROFILE\Downloads\mapa-geral.drawio`" -Destination `"$targetFile`" -Force" -ForegroundColor Cyan
Write-Host ""

Write-Host "MÉTODO 2: Usar Google Drive Desktop App (Automático)" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Instale Google Drive Desktop:" -ForegroundColor White
Write-Host "   https://www.google.com/drive/download/" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Configure sincronização:" -ForegroundColor White
Write-Host "   - Abra Google Drive Desktop" -ForegroundColor Gray
Write-Host "   - Vá em Configurações → Sincronização" -ForegroundColor Gray
Write-Host "   - Adicione pasta: $projectPath" -ForegroundColor Gray
Write-Host "   - OU configure para sincronizar pasta do Google Drive" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Arquivos serão sincronizados automaticamente" -ForegroundColor White
Write-Host ""

Write-Host "MÉTODO 3: Usar Draw.io Web com Acesso Direto" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse Draw.io Web:" -ForegroundColor White
Write-Host "   https://app.diagrams.net/" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Abra arquivo do Google Drive:" -ForegroundColor White
Write-Host "   - File → Open from → Google Drive" -ForegroundColor Gray
Write-Host "   - Selecione seu arquivo" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Edite normalmente" -ForegroundColor White
Write-Host ""
Write-Host "4. Salve de duas formas:" -ForegroundColor White
Write-Host "   a) File → Save (salva no Google Drive)" -ForegroundColor Gray
Write-Host "   b) File → Export as → Device (baixa para computador)" -ForegroundColor Gray
Write-Host "   c) Copie arquivo baixado para: $targetFile" -ForegroundColor Gray
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  WORKFLOW RECOMENDADO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edite no Draw.io Web (https://app.diagrams.net/)" -ForegroundColor White
Write-Host "   - Abra arquivo do Google Drive OU arquivo local" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Salve no Google Drive (backup automático)" -ForegroundColor White
Write-Host "   - File → Save (salva no Google Drive)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Baixe para projeto local (quando necessário)" -ForegroundColor White
Write-Host "   - File → Export as → Device" -ForegroundColor Gray
Write-Host "   - Copie para: docs\diagramas\mapa-geral.drawio" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Versionar no Git" -ForegroundColor White
Write-Host "   - git add docs/diagramas/mapa-geral.drawio" -ForegroundColor Gray
Write-Host "   - git commit -m 'Atualizar diagrama'" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 DICA: Configure Google Drive Desktop para sincronizar automaticamente!" -ForegroundColor Yellow
Write-Host "   Assim você não precisa baixar manualmente toda vez." -ForegroundColor Gray
Write-Host ""



















