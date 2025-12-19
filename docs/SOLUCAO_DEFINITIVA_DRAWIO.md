# ✅ Solução Definitiva: DrawIO no Cursor

## ⚠️ Problema Identificado

A extensão DrawIO (`hediet.vscode-drawio`) no Cursor tem problemas conhecidos:
- Arquivo abre vazio (sem conteúdo)
- Ferramentas não ficam disponíveis/selecionáveis
- Interface não funciona corretamente

**Isso é um bug conhecido da extensão no Cursor IDE.**

## ✅ Solução Recomendada: Usar DrawIO Web

A versão web do DrawIO é **mais confiável** e funciona perfeitamente. Use esta solução:

### Método 1: Script Automático (Mais Fácil)

1. No terminal do Cursor, execute:
   ```powershell
   .\abrir_drawio_web.ps1
   ```

2. O navegador abrirá automaticamente com o DrawIO web e seu arquivo carregado

3. Edite normalmente - todas as ferramentas funcionam

4. Salve com `Ctrl + S` - salva automaticamente no arquivo local

### Método 2: Manual

1. **Abra o navegador** (Chrome, Edge, Firefox)

2. **Acesse:** https://app.diagrams.net/

3. **Arraste o arquivo** `docs/diagramas/mapa-geral.drawio` para o navegador
   - OU clique em **"Open Existing Diagram"**
   - OU use **File → Open from → Device**

4. **Edite normalmente** - todas as ferramentas estão disponíveis

5. **Salve:** `Ctrl + S` ou **File → Save** - salva automaticamente no arquivo local

## 🎯 Vantagens da Versão Web

- ✅ **Todas as ferramentas funcionam** (formas, texto, cores, etc.)
- ✅ **Interface completa e responsiva**
- ✅ **Salva automaticamente** no arquivo local
- ✅ **Mais estável** que a extensão do Cursor
- ✅ **Funciona em qualquer navegador**

## 🔄 Workflow Recomendado

1. **Editar:** Use a versão web (https://app.diagrams.net/)
2. **Visualizar:** Pode abrir no Cursor para ver rapidamente (mesmo que não edite)
3. **Versionar:** O arquivo `.drawio` é salvo normalmente no Git

## 📝 Nota Importante

A extensão DrawIO no Cursor pode funcionar em algumas situações, mas é **inconsistente**. 
A versão web é a solução mais confiável para edição de diagramas.

## 🚀 Atalho Rápido

Crie um atalho no desktop ou favoritos do navegador:
- URL: `https://app.diagrams.net/`
- Nome: "DrawIO - Editar Diagramas"

Assim você pode abrir rapidamente sempre que precisar editar.









