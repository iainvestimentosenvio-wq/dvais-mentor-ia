# 🔧 Solução: DrawIO com Todos Elementos Selecionados

## ⚠️ Problema
Quando o DrawIO abre com todos os elementos selecionados (pontos azuis), não é possível editar o diagrama.

## ✅ Soluções Rápidas (Tente nesta ordem)

### 1. Desselecionar Tudo
- **Pressione `ESC` (Escape)** - Isso deve desselecionar todos os elementos
- **OU clique em uma área vazia** do diagrama (fora de qualquer elemento)
- **OU pressione `Ctrl + D`** para desselecionar

### 2. Fechar e Reabrir
Se a solução 1 não funcionar:
1. **Feche o arquivo**: `Ctrl + W` ou clique no X na aba
2. **Reabra o arquivo**: Clique duas vezes em `docs/diagramas/mapa-geral.drawio` no Explorer
3. O arquivo deve abrir normalmente, sem tudo selecionado

### 3. Usar Command Palette
1. Pressione `Ctrl + Shift + P`
2. Digite: `Draw.io: Reopen Editor`
3. Isso recarrega o editor DrawIO

### 4. Reiniciar o Cursor
Se nada funcionar:
1. Feche completamente o Cursor
2. Abra novamente
3. Abra o arquivo `mapa-geral.drawio`

## 🌐 Alternativa: Usar DrawIO Web
Se o problema persistir, use a versão web:
1. Acesse: https://app.diagrams.net/
2. Arraste o arquivo `docs/diagramas/mapa-geral.drawio` para o navegador
3. Edite normalmente
4. Salve: `Ctrl + S` (salva automaticamente no arquivo local)

## 🔍 Prevenção
As configurações em `.vscode/settings.json` foram atualizadas para evitar esse problema no futuro.

## 📝 Notas
- Esse problema geralmente acontece na primeira vez que o arquivo é aberto
- Após desselecionar uma vez, o problema geralmente não volta
- A extensão DrawIO no Cursor pode ter bugs ocasionais - usar a versão web é uma alternativa confiável










