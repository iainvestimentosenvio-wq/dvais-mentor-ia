#!/bin/bash

# Script para copiar conteúdo dos arquivos para análise
# Gera arquivo markdown com todos os códigos

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_FILE="$PROJECT_ROOT/copiar_para_analise.md"

echo "# Códigos para Análise - Refatoração 10/10" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Data:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Lista de arquivos para copiar
declare -a FILES=(
  "apps/painel-web/app/api/assistente/state.ts"
  "apps/painel-web/app/api/assistente/perguntar/route.ts"
  "apps/painel-web/biblioteca/logs/logOps.ts"
  "apps/painel-web/biblioteca/assistente/sanitize.ts"
  "apps/painel-web/biblioteca/assistente/knowledgeBase.ts"
  "apps/painel-web/componentes/Assistente/Assistente.tsx"
  "apps/painel-web/componentes/Hero.tsx"
  "apps/painel-web/componentes/Assistente/ChatMessage.tsx"
  "apps/painel-web/componentes/Assistente/StatusIndicators.tsx"
  "apps/painel-web/biblioteca/assistente/cometEvents.ts"
  "apps/painel-web/biblioteca/assistente/actionValidator.ts"
  "apps/painel-web/biblioteca/assistente/speechRecognition.ts"
  "apps/painel-web/biblioteca/assistente/textToSpeech.ts"
)

# Contador
FILE_COUNT=0

for FILE in "${FILES[@]}"; do
  FULL_PATH="$PROJECT_ROOT/$FILE"
  
  if [ -f "$FULL_PATH" ]; then
    FILE_COUNT=$((FILE_COUNT + 1))
    
    echo "## $FILE_COUNT. $FILE" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Caminho completo:** \`$FULL_PATH\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`typescript" >> "$OUTPUT_FILE"
    cat "$FULL_PATH" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    echo "✅ Copiado: $FILE"
  else
    echo "⚠️  Arquivo não encontrado: $FILE"
    echo "## $FILE_COUNT. $FILE (NÃO ENCONTRADO)" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Erro:** Arquivo não existe no caminho \`$FULL_PATH\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
  fi
done

# Adicionar resumo no início
TEMP_FILE=$(mktemp)
echo "# Códigos para Análise - Refatoração 10/10" > "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
echo "**Data:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
echo "**Total de arquivos:** $FILE_COUNT" >> "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
echo "---" >> "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
cat "$OUTPUT_FILE" | tail -n +6 >> "$TEMP_FILE"
mv "$TEMP_FILE" "$OUTPUT_FILE"

echo ""
echo "✅ Concluído!"
echo "📄 Arquivo gerado: $OUTPUT_FILE"
echo "📊 Total de arquivos copiados: $FILE_COUNT"

