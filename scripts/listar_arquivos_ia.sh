#!/bin/bash

# Script para listar todos os arquivos relacionados à IA
# Uso: ./scripts/listar_arquivos_ia.sh

echo "🤖 ARQUIVOS RELACIONADOS À INTELIGÊNCIA ARTIFICIAL"
echo "=================================================="
echo ""

cd "$(dirname "$0")/.." || exit

echo "📁 CORE DA IA (Lógica Principal):"
echo "-----------------------------------"
find apps/painel-web/biblioteca/assistente -name "*.ts" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "🌐 APIs E ENDPOINTS:"
echo "-----------------------------------"
find apps/painel-web/app/api -name "*.ts" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "⚛️ COMPONENTES REACT:"
echo "-----------------------------------"
find apps/painel-web/componentes -name "*[Aa]ssistente*" -o -name "*AI*" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "📚 BIBLIOTECAS DE IA:"
echo "-----------------------------------"
find apps/painel-web/biblioteca/ai -name "*.ts" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "🔧 WORKERS:"
echo "-----------------------------------"
find apps/painel-web/public/workers -name "*.ts" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "📊 LOGS E MÉTRICAS:"
echo "-----------------------------------"
find apps/painel-web/biblioteca/logs -name "*.ts" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "⚙️ CONFIGURAÇÕES:"
echo "-----------------------------------"
find apps/painel-web -maxdepth 1 -name "*security*" -o -name "*config*" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "📄 DADOS:"
echo "-----------------------------------"
find apps/painel-web/data -name "*.json" -type f ! -path "*/node_modules/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "📖 DOCUMENTAÇÃO:"
echo "-----------------------------------"
find . -maxdepth 2 -name "*IA*" -o -name "*assistente*" -o -name "*AUDITORIA*" -o -name "*ANALISE*" -type f ! -path "*/node_modules/*" ! -path "*/.next/*" | sort | while read file; do
    echo "  ✅ $file"
done
echo ""

echo "📊 TOTAL DE ARQUIVOS:"
TOTAL=$(find apps/painel-web -type f \( -name "*assistente*" -o -name "*speech*" -o -name "*ai*" -o -name "*knowledge*" -o -name "*intent*" -o -name "*textToSpeech*" -o -name "*logOps*" -o -name "*metrics*" \) ! -path "*/node_modules/*" ! -path "*/.next/*" | wc -l)
echo "  Total: $TOTAL arquivos relacionados à IA"
echo ""

