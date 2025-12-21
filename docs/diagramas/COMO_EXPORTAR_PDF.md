# Como Exportar Diagramas Draw.io para PDF

## ⚠️ Problema: "Desenho muito grande"

Se o Draw.io avisar que o desenho é muito grande, use uma das soluções abaixo.

## ✅ Soluções Profissionais

### **Opção 1: Exportar por Páginas (Recomendado para diagramas grandes)**

Se seu diagrama tem múltiplas páginas, exporte cada página separadamente:

1. No Draw.io, selecione a **página específica** no seletor de páginas (canto inferior esquerdo)
2. **Arquivo** → **Exportar como** → **PDF...**
3. Configure:
   - **Páginas**: Selecione apenas a página atual (ex: "Página 1")
   - **Qualidade**: Alta (300 DPI)
   - **Zoom**: 100% ou ajuste conforme necessário
4. Exporte e salve como: `mapa-geral-pagina-1.pdf`, `mapa-geral-pagina-2.pdf`, etc.

**Vantagem**: PDFs menores e mais gerenciáveis, uma página por arquivo.

---

### **Opção 2: Ajustar Zoom/Scale antes de Exportar**

1. No Draw.io, ajuste o **zoom** da página (Ctrl + Scroll ou botão de zoom)
2. Certifique-se de que todo o diagrama está visível
3. **Arquivo** → **Exportar como** → **PDF...**
4. Configure:
   - **Zoom**: 75% ou 50% (reduz o tamanho do arquivo)
   - **Qualidade**: Média (200 DPI) para arquivos grandes
   - **Páginas**: Todas
5. Exporte

**Vantagem**: Um único PDF, mas otimizado para tamanho.

---

### **Opção 3: Exportar como PNG/SVG (Alternativa Profissional)**

Para diagramas muito grandes, PNG ou SVG podem ser melhores:

#### PNG (para visualização/imagens)
1. **Arquivo** → **Exportar como** → **PNG...**
2. Configure:
   - **Zoom**: 200% ou 300% (para alta qualidade)
   - **Bordas**: 10px (espaçamento ao redor)
   - **Qualidade**: Máxima
3. Salve como: `mapa-geral.png` em `docs/diagramas/`

#### SVG (para edição futura)
1. **Arquivo** → **Exportar como** → **SVG...**
2. Configure:
   - **Incluir uma cópia do diagrama**: ✅ (permite editar depois)
   - **Transparente**: ✅ (se quiser fundo transparente)
3. Salve como: `mapa-geral.svg` em `docs/diagramas/`

**Vantagem**: SVG é vetorial (escala infinita) e PNG é universal.

---

### **Opção 4: Dividir o Diagrama em Partes Menores**

Se o diagrama é muito complexo:

1. Crie **novas páginas** no Draw.io para cada seção
2. Copie/cole elementos relevantes em cada página
3. Exporte cada página separadamente
4. Resultado: `arquitetura-visao-geral.pdf`, `arquitetura-containers.pdf`, etc.

**Vantagem**: Documentação modular e mais fácil de manter.

---

## 📋 Formato Mais Profissional?

### **Para Documentação Técnica:**
- ✅ **PDF** - Melhor para documentos formais, fácil de compartilhar
- ✅ **SVG** - Melhor para edição futura e qualidade vetorial
- ✅ **PNG** - Melhor para READMEs e visualização rápida

### **Recomendação:**
1. **PDF** para documentação oficial (se conseguir exportar)
2. **SVG** como backup (permite editar depois)
3. **PNG** para README.md (visualização rápida no GitHub)

---

## 🎯 Passo a Passo Simplificado

### Se o PDF der erro de "muito grande":

1. **Tente primeiro**: Exportar por páginas (Opção 1)
2. **Se ainda der erro**: Reduza o zoom para 50% (Opção 2)
3. **Alternativa**: Exporte como SVG (Opção 3) - tão profissional quanto PDF
4. **Último recurso**: Divida o diagrama (Opção 4)

---

## 📁 Estrutura Recomendada

```
docs/
  diagramas/
    mapa-geral.drawio           # Arquivo fonte (Draw.io)
    mapa-geral.pdf               # PDF (se conseguir exportar)
    mapa-geral.svg               # SVG (alternativa profissional)
    mapa-geral.png               # PNG (para README)
    LEIA-ME.md
    COMO_EXPORTAR_PDF.md        # Este guia
```

---

## 🚀 Adicionar ao Git

Após exportar (PDF, SVG ou PNG), execute:

```bash
# Para PDF
git add docs/diagramas/mapa-geral.pdf

# Para SVG (alternativa)
git add docs/diagramas/mapa-geral.svg

# Para PNG (alternativa)
git add docs/diagramas/mapa-geral.png

# Commit
git commit -m "docs: Adiciona diagrama de arquitetura exportado"

# Push
git push origin main
```

---

## ✅ Benefícios de Cada Formato

| Formato | Melhor Para | Vantagens |
|---------|-------------|-----------|
| **PDF** | Documentação formal | Universal, fácil de compartilhar |
| **SVG** | Edição futura | Vetorial, escalável, editável |
| **PNG** | Visualização rápida | Leve, funciona em qualquer lugar |

---

## 💡 Dica Final

**Se o PDF der erro**, exporte como **SVG** - é tão profissional quanto e muitas vezes melhor para documentação técnica, pois:
- ✅ É vetorial (qualidade perfeita em qualquer zoom)
- ✅ Pode ser editado depois
- ✅ Funciona no GitHub (visualização nativa)
- ✅ Menor tamanho de arquivo

