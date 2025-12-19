# 🚀 Guia Completo: Preview do Painel

Guia consolidado para visualizar o painel Next.js ao vivo enquanto você programa.

## ⚡ Início Rápido

### 1. Iniciar o Servidor

```bash
cd apps/painel-web
npm run dev
```

Aguarde ver:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

**IMPORTANTE:** Não feche o terminal! O servidor precisa continuar rodando.

### 2. Abrir o Preview

**🥇 OPÇÃO A - Navegador Externo + Split Screen (RECOMENDADO):**
> **Por quê**: Visualização completa, ferramentas de desenvolvedor (F12), sem limitações

1. Abra Chrome/Edge
2. Acesse: `http://localhost:3000`
3. Windows Split Screen:
   - VS Code: `Win + Seta Esquerda`
   - Navegador: `Win + Seta Direita`

**Opção B - Simple Browser (Alternativa):**
> **Nota**: Pode ter limitações de viewport. Use `Ctrl + -` para zoom out se necessário.

1. `Ctrl + Shift + P`
2. Digite: `Simple Browser: Show`
3. URL: `http://localhost:3000`
4. Use `Ctrl + -` para diminuir zoom e ver mais da página

## 🔄 Hot Reload

O painel atualiza automaticamente quando você salva o código:

1. Edite o código (ex: `Hero.tsx`)
2. Salve: `Ctrl + S`
3. Terminal mostra: `✓ Compiled /components/Hero in 234ms`
4. Preview atualiza automaticamente! 🎉

**Se não atualizar:**
- Aguarde alguns segundos
- Recarregue: `Ctrl + R` no preview
- Verifique o terminal por erros

## ⚠️ Troubleshooting

### Preview não abre

**Verifique:**
- [ ] Servidor está rodando? (`npm run dev` executado)
- [ ] Terminal mostra: `✓ Ready in X.Xs`?
- [ ] Navegador externo abre `http://localhost:3000`?

**Solução:**
```bash
# Verificar porta 3000
netstat -ano | findstr :3000

# Se porta ocupada, matar processo
npx kill-port 3000

# Reiniciar servidor
npm run dev
```

### Preview não atualiza

**Solução:**
1. Salve o arquivo: `Ctrl + S`
2. Aguarde 3-5 segundos
3. Recarregue: `Ctrl + R` no preview
4. Limpar cache se necessário:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Simple Browser não aparece

**Solução:**
- Atualize o Cursor: `Help` > `Check for Updates`
- Ou use Opção B (Navegador Externo + Split Screen)

### Erro de compilação

**Solução:**
1. Leia a mensagem de erro no terminal
2. Corrija o erro no código
3. Salve: `Ctrl + S`
4. Aguarde recompilação

## 📋 Atalhos Úteis

- `Ctrl + '` - Abrir/fechar terminal
- `Ctrl + Shift + P` - Command Palette
- `Ctrl + S` - Salvar e atualizar preview
- `Ctrl + R` - Recarregar preview
- `Ctrl + Shift + V` - Abrir Simple Browser (se configurado)

## 🎯 Layout Recomendado

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   CURSOR            │   PREVIEW           │
│   (Código)          │   (Navegador)       │
│                     │                     │
│   - Hero.tsx        │   [Página renderizada]
│   - Header.tsx      │                     │
│   - Features.tsx    │   [Hot reload]      │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

## 💡 Dicas Pro

### Auto-save
Configure o Cursor para salvar automaticamente:
1. `Ctrl + Shift + P`
2. Digite: `Preferences: Open Settings`
3. Configure: `auto save` → `afterDelay`

### Atalho Personalizado
1. `Ctrl + Shift + P`
2. Digite: `Preferences: Open Keyboard Shortcuts`
3. Digite: `Simple Browser`
4. Configure seu atalho preferido

## 🔧 Comandos Úteis

```bash
# Iniciar servidor
npm run dev

# Parar servidor
Ctrl + C

# Limpar cache e reiniciar
rm -rf .next && npm run dev

# Verificar porta 3000
netstat -ano | findstr :3000

# Matar processo na porta 3000
npx kill-port 3000
```

## 📱 Acessar de Outro Dispositivo

Para acessar de outro dispositivo na mesma rede Wi-Fi, veja: [ACESSAR_OUTRO_DISPOSITIVO.md](./ACESSAR_OUTRO_DISPOSITIVO.md)

---

**💡 Dica Pro:** O navegador externo é **melhor** que Simple Browser porque:
- ✅ Visualização completa (vê toda a página)
- ✅ Ferramentas de desenvolvedor (F12)
- ✅ Zoom e rolagem funcionam perfeitamente
- ✅ Sem limitações de viewport

**📖 Para mais detalhes**: Veja [SOLUCAO_PREVIEW_VSCODE.md](./SOLUCAO_PREVIEW_VSCODE.md)

