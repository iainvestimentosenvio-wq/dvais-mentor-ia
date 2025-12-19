# Structurizr Lite - Diagramas C4

Este diretório contém os arquivos do **Structurizr Lite** para gerar diagramas C4 do projeto DVAi$ - Mentor IA.

## 📁 Arquivos

- `workspace.dsl` - Definição do modelo C4 em DSL (Domain Specific Language)

## 🚀 Como Executar

### Pré-requisitos

- Docker instalado e rodando

### Comando Docker

Execute o seguinte comando na raiz do repositório:

```bash
docker run -it --rm -p 8080:8080 -v "%cd%/docs/c4:/usr/local/structurizr" structurizr/lite
```

**No PowerShell:**
```powershell
docker run -it --rm -p 8080:8080 -v "${PWD}/docs/c4:/usr/local/structurizr" structurizr/lite
```

**No Linux/Mac:**
```bash
docker run -it --rm -p 8080:8080 -v "$(pwd)/docs/c4:/usr/local/structurizr" structurizr/lite
```

### Acessar no Navegador

Após executar o comando Docker, acesse:

**http://localhost:8080**

O Structurizr Lite irá:
1. Carregar automaticamente o arquivo `workspace.dsl`
2. Gerar os diagramas C4 (Context, Containers, Components)
3. Exibir uma interface web para visualização

## 📊 Diagramas Disponíveis

O workspace inclui os seguintes diagramas:

1. **Contexto** - Visão geral do sistema e seus relacionamentos externos
2. **Containers** - Arquitetura de containers (aplicações, serviços, bancos de dados)
3. **Componentes do Painel Web** - Estrutura interna do frontend

## 🏷️ Legenda

- **Sistema** (branco) - Sistema principal DVAi$ - Mentor IA
- **Externo** (cinza) - Sistemas externos (Corretoras, Provedores IA, etc.)
- **Container** (azul) - Containers da arquitetura
- **Futuro** (vermelho claro) - Componentes planejados mas ainda não implementados
- **Component** (azul claro) - Componentes internos

## 📝 Estrutura do Modelo

### Contexto (C4 Level 1)
- Usuário
- DVAi$ - Mentor IA (Sistema)
- Corretoras (Binance, etc.)
- Provedores de IA
- Serviços Externos

### Containers (C4 Level 2)
- ✅ **Painel Web** - Aplicação Next.js 14 (implementado)
- 🔜 **Backend API** - [FUTURO]
- 🔜 **Memória** - [FUTURO]
- 🔜 **Dados de Mercado** - [FUTURO]
- 🔜 **Observabilidade** - [FUTURO]

### Componentes do Painel Web (C4 Level 3)
- ✅ **Rotas App** - Next.js App Router (`app/`)
- ✅ **Componentes React** - Componentes reutilizáveis (`componentes/`)
- ✅ **Biblioteca** - Utilitários (`biblioteca/`)
- ✅ **Autenticação** - Sistema de auth (`biblioteca/auth/`)
- ✅ **Processamento IA** - Processamento de IA (`biblioteca/ai/`)
- ✅ **PWA** - Funcionalidades PWA

## 🔧 Editar o Modelo

Para editar o modelo C4:

1. Edite o arquivo `workspace.dsl`
2. Salve o arquivo
3. O Structurizr Lite recarrega automaticamente (hot reload)
4. Atualize o navegador para ver as mudanças

### Sintaxe DSL

O Structurizr DSL segue esta estrutura:

```dsl
workspace "Nome" "Descrição" {
    model {
        # Definir pessoas, sistemas, containers, componentes
    }
    views {
        # Definir diagramas
    }
}
```

## 📚 Referências

- [Structurizr Lite](https://github.com/structurizr/lite)
- [Structurizr DSL](https://github.com/structurizr/dsl)
- [C4 Model](https://c4model.com/)
- [Documentação Structurizr](https://structurizr.com/help)

## ⚠️ Notas

- O Structurizr Lite roda em modo interativo (`-it`)
- O volume monta o diretório `docs/c4` para acesso ao `workspace.dsl`
- A porta `8080` é mapeada para acesso via navegador
- Componentes marcados como **[FUTURO]** são planejados mas ainda não implementados

---

**Última atualização:** 2025-01-27
