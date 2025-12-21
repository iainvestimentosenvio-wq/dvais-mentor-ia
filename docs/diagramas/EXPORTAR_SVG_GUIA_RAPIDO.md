# 🎯 Exportar SVG - Guia Rápido (Recomendado)

## ✅ Por que SVG é a Melhor Opção?

1. **Vetorial = Zoom Infinito**: Você pode dar zoom até 1000% sem perder qualidade
2. **Exporta Tudo**: O zoom da tela NÃO afeta o que é exportado - exporta todo o diagrama
3. **Profissional**: Padrão da indústria para diagramas técnicos
4. **Funciona no GitHub**: Visualização nativa
5. **Editável**: Pode abrir e editar depois no Draw.io

---

## 📋 Passo a Passo Simplificado

### 1. Abrir o Diagrama
- Abra `mapa-geral.drawio` no Draw.io

### 2. Exportar como SVG
1. **Arquivo** → **Exportar como** → **SVG...**
2. Na janela de exportação, configure:
   - ✅ **"Incluir uma cópia do diagrama"** (permite editar depois)
   - ✅ **"Transparente"** (fundo transparente - opcional)
   - ✅ **"Selecionar tudo"** (exporta todo o diagrama, não só o zoom)
3. Clique em **"Exportar"**
4. Salve como: `mapa-geral.svg` em `docs/diagramas/`

### 3. Importante: O Zoom da Tela NÃO Importa!
- ⚠️ O zoom que você vê na tela **NÃO afeta** o que é exportado
- ✅ O SVG exporta **TODO o diagrama**, independente do zoom
- ✅ Depois, no SVG, você pode dar zoom para ver os detalhes pequenos

---

## 🔍 Como Funciona o Zoom no SVG?

### No Navegador (GitHub/Visualização):
- Clique e arraste para navegar
- **Ctrl + Scroll** (ou **Ctrl + +**) para dar zoom
- **Ctrl + 0** para resetar zoom
- Pode dar zoom até ver cada letrinha claramente

### No Draw.io (Edição):
- Abra o SVG no Draw.io
- Pode editar normalmente
- Zoom funciona normalmente

---

## 📊 Comparação: SVG vs PDF vs PNG

| Característica | SVG ✅ | PDF | PNG |
|----------------|--------|-----|-----|
| Zoom infinito | ✅ Sim | ⚠️ Limitado | ❌ Perde qualidade |
| Tamanho arquivo | ✅ Pequeno | ⚠️ Médio | ⚠️ Grande |
| Qualidade | ✅ Perfeita | ✅ Boa | ⚠️ Depende do zoom |
| Editável | ✅ Sim | ❌ Não | ❌ Não |
| GitHub | ✅ Visualização nativa | ⚠️ Download | ✅ Visualização |

---

## 🎯 Resultado Final

Após exportar o SVG:
- ✅ **Uma única página** com todo o diagrama
- ✅ **Zoom infinito** para ver detalhes pequenos
- ✅ **Profissional** e padrão da indústria
- ✅ **Leve** e fácil de compartilhar

---

## 🚀 Adicionar ao Git

```bash
git add docs/diagramas/mapa-geral.svg
git commit -m "docs: Adiciona diagrama de arquitetura em SVG (zoom infinito)"
git push origin main
```

---

## 💡 Dica Extra

Se quiser também um PNG para visualização rápida no README:
1. Exporte SVG (principal)
2. Exporte PNG com zoom 200% (para preview)
3. Adicione ambos ao Git

Resultado: SVG para zoom detalhado, PNG para visualização rápida.

