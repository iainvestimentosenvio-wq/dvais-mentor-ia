#!/bin/bash

# Script para corrigir problemas de file watcher no Linux
# Uso: ./scripts/fix_linux_file_watcher.sh

echo "🔧 Corrigindo limites do inotify no Linux..."
echo ""

# Ver limite atual
CURRENT=$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo "0")
echo "Limite atual: $CURRENT"

# Verificar se precisa aumentar
if [ "$CURRENT" -lt 524288 ]; then
    echo "⚠️  Limite muito baixo! Recomendado: 524288 ou mais"
    echo ""
    echo "Para aumentar, execute:"
    echo "  sudo sysctl fs.inotify.max_user_watches=524288"
    echo ""
    echo "Para tornar permanente:"
    echo "  echo 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf"
    echo "  sudo sysctl -p"
else
    echo "✅ Limite OK"
fi

echo ""
echo "📋 Verificando configurações do Cursor..."
echo ""

# Verificar se settings.json existe
if [ -f "apps/painel-web/.vscode/settings.json" ]; then
    echo "✅ settings.json encontrado"
    
    # Verificar configurações importantes
    if grep -q '"files.autoSave": "off"' apps/painel-web/.vscode/settings.json; then
        echo "✅ Auto-save desabilitado (correto para Linux)"
    else
        echo "⚠️  Auto-save pode estar ativo"
    fi
    
    if grep -q '"editor.formatOnSave": false' apps/painel-web/.vscode/settings.json; then
        echo "✅ Format on save desabilitado (correto para Linux)"
    else
        echo "⚠️  Format on save pode estar ativo"
    fi
else
    echo "❌ settings.json não encontrado"
fi

echo ""
echo "💡 Próximos passos:"
echo "1. Se o limite do inotify estiver baixo, execute os comandos acima"
echo "2. Recarregue a janela do Cursor: Ctrl+Shift+P → 'Reload Window'"
echo "3. Salve arquivos manualmente com Ctrl+S"
echo "4. Formate manualmente com Shift+Alt+F quando necessário"
echo ""


