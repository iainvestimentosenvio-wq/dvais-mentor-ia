Relatorio de continuidade - Vercel deploy (30/12/2025)

Resumo do problema
- O deploy automatico do Vercel parou de disparar apos pushes no GitHub.
- A lista de Deployments mostra apenas erros antigos (ex.: commit fa8024b).
- Mesmo disparando Deploy Hook manual (retorno "state: PENDING"), nenhum novo deploy aparece.

Objetivo
- Voltar a ter deploy automatico do Vercel a cada push no GitHub.
- Garantir que o projeto builda na Vercel com root directory correto.

Repositorio/Projeto
- Repo GitHub: iainvestimentosenvio-wq/dvais-mentor-ia
- Branch principal: main
- Projeto Vercel: dvais-mentor-ia
- Root directory esperado na Vercel: apps/painel-web

Erro original identificado
- Mensagem de erro em deploy antigo (Vercel):
  "The vercel.json schema validation failed with the following message: should NOT have additional property 'rootDirectory'."

Acoes ja executadas
1) Remocao do rootDirectory do vercel.json (codigo)
   - Arquivo: apps/painel-web/vercel.json
   - Commit de fix: f191d27 ("fix: remove rootDirectory from vercel config")
   - Push realizado para origin/main.
   - Confirmado via rg que nao existe "rootDirectory" no repo.

2) Reconfiguracao de Root Directory no painel do Vercel
   - Ajustado em Settings -> Build and Deployment -> Root Directory para apps/painel-web.
   - Campo estava com esse valor e o botao Save ficava desabilitado (ja estava salvo).

3) Reconfiguracao do Git/Vercel
   - Desconectado e reconectado o repo no Vercel (Settings -> Git).
   - No GitHub (App Vercel), acesso de repositorios ajustado para somente:
     iainvestimentosenvio-wq/dvais-mentor-ia (removido o repo DVAi$).
   - Clicado "Save" no GitHub App (Vercel) para confirmar o acesso.

4) Disparo manual de deploy
   - Deploy Hook criado em Settings -> Git -> Deploy Hooks.
   - Acesso ao link do hook retorna JSON com state: PENDING.
   - Mesmo assim, nenhum deploy novo aparece na lista de Deployments.

5) Commit vazio para forcar webhook
   - Commit vazio criado e enviado:
     3df9795 "chore: trigger vercel deploy"
   - git push origin main executado com sucesso.
   - Esperado: novo deploy no Vercel com esse commit, mas ainda nao apareceu.

Estado atual observado (Vercel)
- Deployments mostra apenas historico antigo (ex.: fa8024b e anteriores).
- O deploy "Ready" visivel e antigo (Dec 23).
- Nao ha novo deploy com f191d27 ou 3df9795.
- Filtros de data podem esconder deploys; usuario removeu, mas nada novo apareceu.

Estado atual observado (GitHub)
- Repo atualizado: main contem f191d27 e 3df9795.
- Vercel App instalada e com acesso ao repo dvais-mentor-ia (somente este).

Riscos/hipoteses
- Webhook do GitHub para Vercel nao esta sendo registrado/ativado corretamente.
- Vercel pode estar conectado a outro projeto/branch sem receber eventos do repo correto.
- Filtros no painel do Vercel podem estar ocultando deploys (tempo/status).
- Deploys podem estar sendo criados em outro projeto Vercel (ex.: outro workspace/projeto com o mesmo repo).

Proximos passos sugeridos (para a proxima IA)
1) Confirmar em Vercel:
   - Settings -> Git -> Production Branch = main.
   - Automatic Deployments = ON (Production/Preview).
   - Ignored Build Step = Automatic.
2) Verificar no GitHub:
   - Repo -> Settings -> Webhooks: confirmar webhook da Vercel e eventos recentes.
3) Forcar deploy diretamente pela Vercel:
   - Deployments -> clicar em "Redeploy" com a opcao "Redeploy with latest".
4) Verificar se ha outro projeto Vercel conectado ao mesmo repo:
   - No painel Vercel, buscar por outros projetos que usem dvais-mentor-ia.
5) Se continuar sem deploy, criar novo projeto Vercel:
   - Importar repo novamente, definir Root Directory apps/painel-web.
   - Comparar se o novo projeto recebe deploys automaticamente.

Comandos executados localmente
- git status -sb (para confirmar branch e dirty state)
- rg -n "rootDirectory" -S . (confirmar ausencia no repo)
- git commit --allow-empty -m "chore: trigger vercel deploy"
- git push origin main

Commits relevantes
- fa8024b: "chore: atualiza plataforma, assistente e docs" (deploy com erro rootDirectory)
- f191d27: "fix: remove rootDirectory from vercel config"
- 3df9795: "chore: trigger vercel deploy" (commit vazio)

Observacao importante (repo local)
- Existem mudancas locais NAO commitadas:
  - apps/painel-web/biblioteca/circuitBreaker/kvCircuitBreaker.ts
  - apps/painel-web/biblioteca/rateLimit/kvRateLimiter.ts
  - apps/painel-web/scripts/verificar_kv.ts

Resultado atual
- Deploy automatico ainda nao voltou.
- Deploy novo nao aparece na lista, mesmo com commit vazio e deploy hook manual.
