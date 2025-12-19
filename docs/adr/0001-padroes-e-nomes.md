# ADR 0001: Padrões de Nomenclatura e Estrutura

## Padrão de Nomes de Pastas

- Usar **kebab-case** (letras minúsculas separadas por hífens)
- **Sem acentos** em nomes de pastas e arquivos
- Exemplos: `apps/`, `services/`, `packages/`, `docs/adr/`

## Regras de Build Outputs

Build outputs e dependências **não entram no git**:

- `.next/` - Build do Next.js
- `node_modules/` - Dependências npm/yarn
- `.dist/`, `dist/` - Arquivos compilados
- `.build/`, `build/` - Arquivos de build
- `*.log` - Arquivos de log (exceto logs estruturados em `storage/logs/`)
- `.env.local`, `.env.*.local` - Variáveis de ambiente locais

Todos esses devem estar no `.gitignore`.
