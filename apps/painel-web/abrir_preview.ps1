# Script para abrir o Simple Browser do VSCode/Cursor
# Este script verifica o servidor e instrui como abrir o Simple Browser

# Verificar se o servidor está rodando
$portCheck = netstat -ano | findstr :3000 | findstr LISTENING
if (-not $portCheck) {
    Write-Host "AVISO: Servidor nao esta rodando na porta 3000!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Execute primeiro:" -ForegroundColor Cyan
    Write-Host "  cd apps/painel-web" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "OK: Servidor esta rodando na porta 3000" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Para abrir o Simple Browser no VSCode/Cursor:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  OPÇÃO 1 - Atalho de Teclado (Recomendado):" -ForegroundColor Green
Write-Host "    Pressione: Ctrl + Shift + V" -ForegroundColor White
Write-Host "    Digite a URL: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "  OPÇÃO 2 - Command Palette:" -ForegroundColor Green
Write-Host "    1. Pressione: Ctrl + Shift + P" -ForegroundColor White
Write-Host "    2. Digite: Simple Browser: Show" -ForegroundColor White
Write-Host "    3. Digite a URL: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dica: O atalho Ctrl + Shift + V ja esta configurado!" -ForegroundColor Cyan
Write-Host "   Use-o sempre que quiser abrir o preview." -ForegroundColor White
Write-Host ""

