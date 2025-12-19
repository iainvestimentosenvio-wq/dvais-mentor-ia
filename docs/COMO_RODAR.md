# Como Rodar o Projeto

## Frontend (Next.js)

O frontend está localizado em `apps/painel-web/`.

### Instalação e Execução

```bash
# 1. Navegar para a pasta do frontend
cd apps/painel-web

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Para build de produção
npm run build
```

### Acessar a Aplicação

Após iniciar o servidor de desenvolvimento:
- **URL Local**: http://localhost:3000
- **URL em Rede**: http://[seu-ip]:3000 (para acesso de outros dispositivos na mesma rede)

### Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento com hot reload
- `npm run build` - Gera build otimizado de produção
- `npm run start` - Inicia servidor de produção (após build)
- `npm run lint` - Executa linter para verificar código
- `npm run analyze` - Analisa tamanho do bundle

### Troubleshooting

Se encontrar problemas:

```bash
# Limpar cache do Next.js
cd apps/painel-web
Remove-Item -Recurse -Force .next
npm run dev

# Reinstalar dependências
Remove-Item -Recurse -Force node_modules
npm install
```

### Documentação Adicional

- Para mais detalhes sobre desenvolvimento, veja `apps/painel-web/README.md`
- Para guia de preview, veja `apps/painel-web/GUIA_PREVIEW.md`
- Para boas práticas, veja `apps/painel-web/GUIA_BOAS_PRATICAS.md`
