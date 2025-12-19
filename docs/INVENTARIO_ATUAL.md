# Inventário Atual do Repositório

## Raiz do Next.js

**Raiz do projeto Next.js:** `./apps/painel-web`

**Confirmação:**
- ✅ Contém `package.json` com Next.js como dependência
- ✅ Contém `next.config.js` com configurações do Next.js
- ✅ Contém pasta `app/` (Next App Router)
- ✅ Estrutura completa de projeto Next.js 14

## Estrutura de Pastas Atuais

### Raiz do Repositório

- **`Painel_Web/`** - Raiz do projeto Next.js (frontend)
  - Aplicação completa com App Router
  - Componentes React/TypeScript
  - Configurações de build e PWA

- **`docs/`** - Documentação do projeto
  - `LEIA-ME_ARQUITETURA.md` - Arquitetura e navegação
  - `ROADMAP.md` - Roadmap de desenvolvimento
  - `adr/` - Architecture Decision Records
  - `INVENTARIO_ATUAL.md` - Este arquivo

- **`mnt/`** - Dados de montagem/usuário
  - `user-data/outputs/` - Arquivos de saída gerados

- **`.cursor/`** - Configurações do Cursor IDE
  - `plans/` - Planos de desenvolvimento

- **`apps/`** - (Nova pasta criada) - Aplicações do monorepo
- **`services/`** - (Nova pasta criada) - Serviços backend
- **`packages/`** - (Nova pasta criada) - Pacotes compartilhados
- **`tools/`** - (Nova pasta criada) - Ferramentas e scripts
- **`assets/`** - (Nova pasta criada) - Assets compartilhados

### Arquivos na Raiz

- Documentos Word (.docx) - Documentação de apresentação e execução
- PDF técnico - `DVAiS_MentorIA_Documento_Tecnico.pdf`
- `ORGANIZACAO_RENDERIZACAO.md` - Documentação de renderização

## Pastas Build/Geradas (Devem ser Ignoradas)

### Dentro de `apps/painel-web/`

- **`.next/`** - Build do Next.js
  - Arquivos compilados e cache do Next.js
  - Gerado automaticamente ao rodar `npm run dev` ou `npm run build`

- **`node_modules/`** - Dependências npm
  - Todas as dependências instaladas via npm/yarn
  - Regenerado via `npm install`

- **`out/`** - Build de exportação estática
  - Gerado quando usa `next export` ou configuração de exportação estática

- **`.vercel/`** - Cache do Vercel (se usado)
  - Configurações e cache de deploy

- **`*.tsbuildinfo`** - Arquivos de cache do TypeScript
  - Informações de build incremental do TypeScript

- **`next-env.d.ts`** - Arquivo gerado automaticamente
  - Tipos do Next.js gerados automaticamente

### Arquivos de Log

- **`npm-debug.log*`** - Logs de debug do npm
- **`yarn-debug.log*`** - Logs de debug do yarn
- **`yarn-error.log*`** - Logs de erro do yarn

### Arquivos de Ambiente Local

- **`.env*.local`** - Variáveis de ambiente locais
  - Não devem ser versionados por segurança

## Status do .gitignore

O arquivo `Painel_Web/.gitignore` já está configurado corretamente e ignora:
- ✅ `/node_modules`
- ✅ `/.next/`
- ✅ `/out/`
- ✅ `/build`
- ✅ `.env*.local`
- ✅ `.vercel`
- ✅ `*.tsbuildinfo`
- ✅ `next-env.d.ts`
- ✅ Logs npm/yarn

## Observações

- A estrutura atual tem o Next.js em `apps/painel-web/` (organizado como monorepo)
- As novas pastas criadas (`apps/`, `services/`, `packages/`, etc.) estão prontas para uma possível reorganização em monorepo
- Documentos Word e PDF na raiz podem ser movidos para `docs/` ou `assets/` no futuro
