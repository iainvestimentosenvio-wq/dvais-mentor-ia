# Higienização do Repositório

Este documento descreve as ações de higienização realizadas no repositório para garantir que apenas arquivos relevantes sejam versionados.

## .gitignore na Raiz

Foi criado/atualizado o arquivo `.gitignore` na raiz do repositório com as seguintes regras globais:

### Dependências
- `**/node_modules/` - Todas as pastas node_modules em qualquer nível

### Build Outputs
- `**/.next/` - Build do Next.js em qualquer projeto
- `**/out/` - Build de exportação estática do Next.js
- `**/.vercel/` - Cache e configurações do Vercel
- `**/.cache/` - Cache geral de ferramentas

### Logs
- `**/*.log` - Todos os arquivos de log
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*` - Logs específicos do npm/yarn

### TypeScript
- `**/*.tsbuildinfo` - Arquivos de cache incremental do TypeScript

### Arquivos Comprimidos
- `*.pack.gz` - Arquivos comprimidos

### Outputs Específicos
- `mnt/user-data/outputs/` - Arquivos de saída gerados

### Específicos do painel-web
- `apps/painel-web/.next/` - Build do Next.js do frontend
- `apps/painel-web/node_modules/` - Dependências do frontend

### Outros
- Arquivos de ambiente local (`.env*.local`)
- Arquivos do sistema operacional (`.DS_Store`, `Thumbs.db`)
- Arquivos de IDEs (`.vscode/`, `.idea/`)
- Arquivos temporários

## Pastas que Devem ser Removidas do Índice do Git

**Status Atual**: O repositório ainda não foi inicializado como Git. Quando inicializar, execute os comandos abaixo para remover do índice (mas manter no disco) as pastas que não devem ser versionadas:

```bash
# Remover do índice sem apagar do disco
git rm -r --cached apps/painel-web/node_modules/
git rm -r --cached apps/painel-web/.next/
git rm -r --cached apps/painel-web/out/
git rm -r --cached apps/painel-web/.vercel/
git rm -r --cached mnt/user-data/outputs/

# Adicionar as mudanças
git add .gitignore
git add .

# Fazer commit
git commit -m "chore: adiciona .gitignore e remove arquivos de build do índice"
```

**Status atual**: O repositório ainda não foi inicializado como Git. O `.gitignore` já está configurado na raiz e será aplicado automaticamente quando o Git for inicializado.

### Comandos para Executar Após Inicializar o Git

Se você já tiver inicializado o Git e algumas dessas pastas estiverem sendo rastreadas, execute:

```bash
# Verificar quais arquivos estão sendo rastreados (se houver)
git ls-files | grep -E "node_modules|\.next|out|\.vercel|\.log|\.tsbuildinfo"

# Remover do índice sem apagar do disco (apenas se estiverem rastreados)
git rm -r --cached apps/painel-web/node_modules/ 2>$null
git rm -r --cached apps/painel-web/.next/ 2>$null
git rm -r --cached apps/painel-web/out/ 2>$null
git rm -r --cached apps/painel-web/.vercel/ 2>$null
git rm -r --cached mnt/user-data/outputs/ 2>$null

# Adicionar o .gitignore
git add .gitignore

# Fazer commit
git commit -m "chore: adiciona .gitignore e remove arquivos de build do índice"
```

## Como Verificar se Está Limpo

### Verificar status do Git
```bash
git status
```

Você não deve ver:
- ❌ `node_modules/` em nenhum lugar
- ❌ `.next/` em nenhum lugar
- ❌ `out/` em nenhum lugar
- ❌ `.vercel/` em nenhum lugar
- ❌ Arquivos `.log`
- ❌ Arquivos `.tsbuildinfo`
- ❌ `mnt/user-data/outputs/`

### Verificar arquivos rastreados
```bash
# Ver todos os arquivos rastreados
git ls-files

# Verificar se algum arquivo ignorado está sendo rastreado
git ls-files | grep -E "node_modules|\.next|out|\.vercel|\.log|\.tsbuildinfo"
```

Se algum arquivo ignorado aparecer, remova do índice:
```bash
git rm -r --cached <caminho-do-arquivo>
```

### Verificar se .gitignore está funcionando
```bash
# Testar se um arquivo seria ignorado
git check-ignore -v apps/painel-web/node_modules/
```

Se retornar o caminho, está funcionando corretamente.

## Estrutura Esperada

Após a higienização, o repositório deve conter apenas:

✅ **Código fonte**
- `apps/painel-web/app/`
- `apps/painel-web/componentes/`
- `apps/painel-web/biblioteca/`
- `apps/painel-web/tipos/`
- `apps/painel-web/public/` (assets estáticos)
- Arquivos de configuração (`.json`, `.js`, `.ts`, `.md`)

✅ **Documentação**
- `docs/`
- Arquivos `.md` na raiz

❌ **NÃO deve conter** (devem estar no .gitignore):
- `node_modules/`
- `.next/`
- `out/`
- `.vercel/`
- Arquivos `.log`
- Arquivos `.tsbuildinfo`
- `mnt/user-data/outputs/`

## Manutenção Futura

Sempre que adicionar novos projetos ou pastas com builds:

1. **Adicione ao .gitignore** antes de fazer commit
2. **Verifique** com `git status` antes de commitar
3. **Remova do índice** se já estiver rastreado: `git rm -r --cached <pasta>`

## Comandos Úteis

```bash
# Ver tamanho do repositório (sem node_modules)
git count-objects -vH

# Limpar cache do Git
git gc --prune=now

# Verificar arquivos grandes no histórico
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10
```
