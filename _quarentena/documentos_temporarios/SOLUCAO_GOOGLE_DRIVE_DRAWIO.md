# 🔄 Solução: Draw.io com Google Drive no Cursor

## 📋 Problema

Quando você usa o Draw.io no navegador, ele salva no **Google Drive**, não no seu computador. Isso significa que:

- ✅ Arquivo fica salvo no Google Drive (backup automático)
- ❌ Arquivo não fica no projeto local (não aparece no Cursor)
- ❌ Não consegue versionar no Git
- ❌ Não consegue abrir diretamente no Cursor

## ✅ Soluções

### Solução 1: Sincronizar Google Drive com Pasta Local (Recomendado)

**Usando Google Drive Desktop App:**

1. **Instale Google Drive Desktop:**
   - Baixe: https://www.google.com/drive/download/
   - Instale e configure sua conta

2. **Configure Sincronização:**
   - Abra Google Drive Desktop
   - Vá em **Configurações → Sincronização**
   - Adicione a pasta do projeto: `docs\diagramas\`
   - OU configure para sincronizar uma pasta do Google Drive com `docs\diagramas\`

3. **Workflow:**
   - Edite no Draw.io Web (salva no Google Drive)
   - Google Drive Desktop sincroniza automaticamente
   - Arquivo aparece em `docs\diagramas\` no Cursor
   - Pode versionar no Git normalmente

---

### Solução 2: Baixar Manualmente do Google Drive

**Quando editar no Draw.io Web:**

1. **Edite no navegador:**
   - Acesse: https://app.diagrams.net/
   - Abra arquivo do Google Drive
   - Edite normalmente

2. **Salve e baixe:**
   - **File → Save** (salva no Google Drive)
   - **File → Export as → Device** (baixa para computador)
   - OU **File → Download** (baixa arquivo .drawio)

3. **Copie para projeto:**
   - Copie o arquivo baixado para: `docs\diagramas\mapa-geral.drawio`
   - Substitua o arquivo antigo
   - Faça commit no Git

---

### Solução 3: Usar Draw.io Web com Acesso Local

**Configurar Draw.io para salvar localmente:**

1. **Abra Draw.io Web:**
   - Acesse: https://app.diagrams.net/

2. **Configure para salvar local:**
   - **File → Preferences → Editor**
   - Marque: **"Save to device"** ou **"Local storage"**
   - OU sempre use **File → Save as → Device**

3. **Workflow:**
   - Edite no Draw.io Web
   - Salve diretamente em: `docs\diagramas\mapa-geral.drawio`
   - Arquivo fica no projeto local
   - Pode versionar no Git

---

### Solução 4: Usar App Desktop do Draw.io

**App desktop salva localmente por padrão:**

1. **Baixe o app:**
   - Acesse: https://app.diagrams.net/download
   - Baixe para Windows

2. **Configure pasta do projeto:**
   - Abra o app
   - **File → Open** → Selecione `docs\diagramas\mapa-geral.drawio`
   - Edite normalmente
   - **Ctrl + S** salva automaticamente no arquivo local

3. **Vantagens:**
   - ✅ Salva sempre no computador
   - ✅ Não precisa sincronizar
   - ✅ Funciona offline
   - ✅ Pode versionar no Git

---

## 🔍 Por Que Draw.io Não Funciona no Cursor?

**Problemas conhecidos da extensão `hediet.vscode-drawio` no Cursor:**

1. **Bug da extensão:**
   - A extensão foi feita para VS Code
   - Cursor é baseado em VS Code, mas tem diferenças
   - Extensão pode não funcionar corretamente

2. **Problemas específicos:**
   - Arquivo abre vazio (sem conteúdo)
   - Ferramentas não ficam disponíveis
   - Interface não responde
   - Erro "Assertion Failed"

3. **Solução:**
   - Use Draw.io Web ou App Desktop (mais confiável)
   - Extensão no Cursor é inconsistente

---

## 🎯 Workflow Recomendado

**Para trabalhar com Draw.io e Google Drive:**

1. **Editar:**
   - Use Draw.io Web (https://app.diagrams.net/)
   - Abra arquivo do Google Drive OU arquivo local
   - Edite normalmente

2. **Salvar:**
   - **Opção A:** Salve no Google Drive (backup automático)
   - **Opção B:** Baixe para `docs\diagramas\` (versionar no Git)
   - **Opção C:** Faça ambos (backup + versionamento)

3. **Sincronizar:**
   - Use Google Drive Desktop para sincronizar automaticamente
   - OU baixe manualmente quando necessário

4. **Versionar:**
   - Quando arquivo estiver em `docs\diagramas\`
   - Faça commit no Git normalmente
   - Arquivo `.drawio` é texto (XML), funciona bem no Git

---

## 📝 Notas Importantes

- **Draw.io Web** salva no Google Drive por padrão (se você estiver logado)
- **Para salvar localmente**, use **File → Save as → Device**
- **Google Drive Desktop** pode sincronizar automaticamente
- **Extensão no Cursor** tem bugs conhecidos - use alternativas
- **Arquivo `.drawio`** é XML texto - funciona bem no Git

---

**Última atualização:** 2025-01-27







