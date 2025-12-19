# Diagramas do Projeto

Este diretório contém diagramas versionados usando **diagrams.net (draw.io)**.

## 📁 Arquivos

- `mapa-geral.drawio` - Diagrama principal com múltiplas páginas

## 🚀 Como Abrir

### Opção 1: Web App (Recomendado)

1. Acesse [diagrams.net](https://app.diagrams.net/) (ou [draw.io](https://draw.io))
2. Clique em **"Open Existing Diagram"**
3. Selecione o arquivo `.drawio` deste diretório
4. Edite e salve diretamente (Ctrl+S / Cmd+S)

### Opção 2: Extensão VS Code / Cursor

1. Instale a extensão **"Draw.io Integration"** ou **"Draw.io Preview"**
2. Abra o arquivo `.drawio` no editor
3. A extensão abrirá uma visualização/editável do diagrama

### Opção 3: Desktop App

1. Baixe o app desktop em [diagrams.net/download](https://app.diagrams.net/download)
2. Abra o arquivo `.drawio` no app
3. Salve normalmente (Ctrl+S / Cmd+S)

## 📄 Convenção de Páginas

O arquivo `mapa-geral.drawio` segue esta estrutura de páginas:

1. **Visão Geral** - Arquitetura de alto nível, contexto do sistema (usuário, Binance, provedores IA)
2. **Containers** - Diagrama C4 Containers (Browser Extension, Backend API, Market Data Service, AI Orchestrator, Redis, Postgres)
3. **Componentes** - Componentes do Painel Web (`apps/painel-web`) e da Browser Extension (Overlay, Data Capture, Auth)

### Como Navegar entre Páginas

- No diagrams.net: Use o seletor de páginas no canto inferior esquerdo
- No VS Code: A extensão geralmente mostra abas para cada página

## 📤 Exportar Imagens

### Exportar PNG/SVG para `docs/imagens/`

1. No diagrams.net:
   - **File → Export as → PNG** (ou SVG)
   - Escolha a resolução (recomendado: 300 DPI para PNG)
   - Salve em `docs/imagens/` com nome descritivo
     - Exemplo: `docs/imagens/arquitetura-visao-geral.png`
     - Exemplo: `docs/imagens/containers-c4.svg`

2. No VS Code (com extensão):
   - Geralmente há opção de exportar no menu da extensão
   - Ou use o comando da extensão para exportar

### Convenção de Nomes

- `arquitetura-{nome}.png` - Diagramas de arquitetura
- `fluxo-{nome}.png` - Diagramas de fluxo
- `componentes-{nome}.png` - Diagramas de componentes
- Use `-` (hífen) e letras minúsculas

## ✅ Boas Práticas

1. **Versionamento**: Sempre commite o arquivo `.drawio` junto com as mudanças
2. **Páginas**: Mantenha cada página focada em um nível de abstração
3. **Exportação**: Exporte PNG/SVG apenas quando necessário para documentação estática
4. **Nomes**: Use nomes descritivos e consistentes
5. **Cores**: Siga o padrão de cores do projeto (se houver)

## 🔗 Referências

- [diagrams.net](https://app.diagrams.net/)
- [Documentação do draw.io](https://www.diagrams.net/doc/)
- [C4 Model](https://c4model.com/) - Para diagramas de arquitetura

---

**Última atualização:** 2025-01-27
