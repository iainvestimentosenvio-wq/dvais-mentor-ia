#!/bin/bash

# Script para editar arquivos quando o Cursor não salva
# Uso: ./scripts/editar_arquivo.sh caminho/do/arquivo

if [ -z "$1" ]; then
    echo "Uso: ./scripts/editar_arquivo.sh caminho/do/arquivo"
    echo "Exemplo: ./scripts/editar_arquivo.sh apps/painel-web/app/api/assistente/state.ts"
    exit 1
fi

FILE="$1"

if [ ! -f "$FILE" ]; then
    echo "❌ Arquivo não encontrado: $FILE"
    exit 1
fi

echo "📝 Editando: $FILE"
echo ""
echo "Opções:"
echo "1. nano (mais fácil)"
echo "2. vim (avançado)"
echo "3. code (abrir no Cursor - pode não funcionar)"
echo ""
read -p "Escolha (1-3): " choice

case $choice in
    1)
        nano "$FILE"
        ;;
    2)
        vim "$FILE"
        ;;
    3)
        code "$FILE" 2>/dev/null || cursor "$FILE" 2>/dev/null || echo "Cursor não encontrado, use opção 1 ou 2"
        ;;
    *)
        echo "Opção inválida, usando nano..."
        nano "$FILE"
        ;;
esac

echo ""
echo "✅ Edição concluída!"
echo "Arquivo salvo em: $FILE"

