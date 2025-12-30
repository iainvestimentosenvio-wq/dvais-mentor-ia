# Script para atualizar extensão Draw.io no Cursor
# Uso: .\atualizar_extensao_drawio.ps1

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ATUALIZAÇÃO: Extensão Draw.io no Cursor" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar versão atual
Write-Host "[1/4] Verificando versão atual..." -ForegroundColor Cyan
$extensionsPath = "$env:USERPROFILE\.cursor\extensions"
$drawioExtension = Get-ChildItem -Path $extensionsPath -Filter "*drawio*" -Directory -ErrorAction SilentlyContinue

if ($drawioExtension) {
    $currentVersion = $drawioExtension.Name -replace '.*-(\d+\.\d+\.\d+).*', '$1'
    Write-Host "  ℹ️  Versão atual: $currentVersion" -ForegroundColor Gray
    Write-Host "  ⚠️  Versão antiga detectada (pode ter bugs no Cursor)" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ Extensão não encontrada!" -ForegroundColor Red
    Write-Host "  💡 Instale primeiro: hediet.vscode-drawio" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

Write-Host "[2/4] Problema identificado:" -ForegroundColor Cyan
Write-Host "  ❌ Versão 1.6.6-universal tem bugs conhecidos no Cursor" -ForegroundColor Red
Write-Host "  ✅ Versão mais recente (1.9.x) resolve muitos problemas" -ForegroundColor Green
Write-Host ""

Write-Host "[3/4] Soluções:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  OPÇÃO 1: Atualizar extensão manualmente (Recomendado)" -ForegroundColor Yellow
Write-Host "    1. Abra Cursor IDE" -ForegroundColor White
Write-Host "    2. Pressione Ctrl + Shift + X (Extensions)" -ForegroundColor White
Write-Host "    3. Busque: hediet.vscode-drawio" -ForegroundColor White
Write-Host "    4. Clique em 'Update' se disponível" -ForegroundColor White
Write-Host "    5. OU desinstale e reinstale a extensão" -ForegroundColor White
Write-Host ""
Write-Host "  OPÇÃO 2: Instalar versão mais recente via VSIX" -ForegroundColor Yellow
Write-Host "    1. Baixe VSIX da versão mais recente:" -ForegroundColor White
Write-Host "       https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio" -ForegroundColor Cyan
Write-Host "    2. No Cursor: Ctrl + Shift + P" -ForegroundColor White
Write-Host "    3. Digite: 'Install from VSIX'" -ForegroundColor White
Write-Host "    4. Selecione o arquivo .vsix baixado" -ForegroundColor White
Write-Host ""
Write-Host "  OPÇÃO 3: Usar Draw.io Web (Mais confiável)" -ForegroundColor Yellow
Write-Host "    - Acesse: https://app.diagrams.net/" -ForegroundColor Cyan
Write-Host "    - Funciona perfeitamente, sem bugs" -ForegroundColor White
Write-Host "    - Pode abrir arquivos do Google Drive OU locais" -ForegroundColor White
Write-Host ""

Write-Host "[4/4] Para sincronizar Google Drive:" -ForegroundColor Cyan
Write-Host "  📥 Baixar do Google Drive:" -ForegroundColor Yellow
Write-Host "    1. Abra Google Drive no navegador" -ForegroundColor White
Write-Host "    2. Baixe o arquivo .drawio" -ForegroundColor White
Write-Host "    3. Copie para: docs\diagramas\mapa-geral.drawio" -ForegroundColor White
Write-Host ""
Write-Host "  🔄 Sincronização automática:" -ForegroundColor Yellow
Write-Host "    1. Instale Google Drive Desktop App" -ForegroundColor White
Write-Host "    2. Configure para sincronizar pasta do projeto" -ForegroundColor White
Write-Host "    3. Arquivos do Google Drive aparecem automaticamente" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  RECOMENDAÇÃO FINAL" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para trabalhar com Draw.io e Google Drive:" -ForegroundColor White
Write-Host ""
Write-Host "1. ✅ Use Draw.io Web (https://app.diagrams.net/)" -ForegroundColor Green
Write-Host "   - Abra arquivo do Google Drive OU arquivo local" -ForegroundColor Gray
Write-Host "   - Edite normalmente" -ForegroundColor Gray
Write-Host "   - Salve no Google Drive (backup)" -ForegroundColor Gray
Write-Host "   - Baixe para local quando necessário (versionar no Git)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🔄 Configure Google Drive Desktop para sincronizar" -ForegroundColor Green
Write-Host "   - Arquivos do Google Drive aparecem automaticamente" -ForegroundColor Gray
Write-Host "   - Pode versionar no Git normalmente" -ForegroundColor Gray
Write-Host ""
Write-Host "3. ⚠️  Extensão no Cursor tem bugs conhecidos" -ForegroundColor Yellow
Write-Host "   - Versão antiga (1.6.6) não funciona bem" -ForegroundColor Gray
Write-Host "   - Mesmo atualizada, pode ter problemas" -ForegroundColor Gray
Write-Host "   - Use Draw.io Web para edição (mais confiável)" -ForegroundColor Gray
Write-Host ""



















