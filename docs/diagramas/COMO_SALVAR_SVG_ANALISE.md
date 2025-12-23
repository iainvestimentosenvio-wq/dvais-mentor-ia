# 📁 Como Salvar SVG para Análise Profissional

## 🎯 Nomenclatura Padronizada

### Formato Recomendado:

```
{contexto}-{tipo}-{data}-v{versao}.svg
```

### Exemplos:

```
arquitetura-frontend-2025-01-27-v1.svg
estrutura-projeto-2025-01-27-v1.svg
fluxo-usuario-2025-01-27-v1.svg
componentes-ui-2025-01-27-v1.svg
```

### Partes do Nome:

1. **Contexto**: `arquitetura`, `estrutura`, `fluxo`, `componentes`
2. **Tipo**: `frontend`, `backend`, `projeto`, `usuario`, `ui`
3. **Data**: `YYYY-MM-DD` (ISO 8601)
4. **Versão**: `v1`, `v2`, `v3` (incrementar quando houver mudanças significativas)

---

## 📂 Localização

**Sempre salvar em**: `docs/diagramas/`

```
docs/diagramas/
├── arquitetura-frontend-2025-01-27-v1.svg
├── arquitetura-frontend-2025-01-27-v1.drawio
├── estrutura-projeto-2025-01-27-v1.svg
└── ...
```

---

## 🔄 Versionamento

### Quando Incrementar Versão:

- ✅ Mudanças significativas na arquitetura
- ✅ Adição de novos módulos principais
- ✅ Refatoração importante
- ✅ Mudanças no fluxo de dados

### Quando NÃO Incrementar:

- ❌ Correções de bugs
- ❌ Ajustes visuais menores
- ❌ Atualizações de texto
- ❌ Melhorias de layout

---

## 📋 Checklist Antes de Salvar

- [ ] Nome segue o padrão: `{contexto}-{tipo}-{data}-v{versao}.svg`
- [ ] Data está no formato ISO 8601 (YYYY-MM-DD)
- [ ] Versão está correta (v1, v2, etc.)
- [ ] Arquivo está em `docs/diagramas/`
- [ ] SVG exportado com qualidade alta
- [ ] Draw.io source também salvo (`.drawio`)
- [ ] Arquivo não está muito grande (< 5MB)

---

## 🎨 Configurações de Exportação

### Para Análise Profissional:

1. **Formato**: SVG
2. **Zoom**: 100%
3. **Qualidade**: Alta
4. **Incluir cópia do diagrama**: ✅ (para editar depois)
5. **Transparente**: ✅ (melhor visualização)
6. **Embed Fonts**: ✅ (garante fontes corretas)

---

## 📝 Exemplo Completo

### Situação: Salvar diagrama de arquitetura do frontend atual

**Nome do arquivo**:
```
arquitetura-frontend-2025-01-27-v1.svg
```

**Draw.io source**:
```
arquitetura-frontend-2025-01-27-v1.drawio
```

**Localização**:
```
docs/diagramas/arquitetura-frontend-2025-01-27-v1.svg
docs/diagramas/arquitetura-frontend-2025-01-27-v1.drawio
```

---

## 🔍 Para Análise Futura

Quando for fazer análise profissional:

1. **Abrir SVG mais recente** (data mais recente)
2. **Comparar com código atual** (verificar se está atualizado)
3. **Usar como referência visual** durante análise
4. **Atualizar se necessário** após melhorias

---

## 💡 Dica

**Sempre salve também o arquivo `.drawio`** para poder editar depois!

Formato: `{mesmo-nome}.drawio`

