# Padrao de Versionamento e Git Flow (Sportfind)

## Visao Geral
Como parte das nossas praticas de engenharia de software, adotamos um modelo de Git Flow Direto, focado em agilidade extrema, integracao continua e estabilidade em producao.

O fluxo baseia-se em duas branches de vida longa principais:
- main (Producao)
- dev (Desenvolvimento e Integracao)

Neste modelo, o desenvolvimento ocorre diretamente na branch dev, consolidando o esforco da equipe em uma unica linha de base antes da promocao para producao.

---

## Arquitetura de Branches

### 1. main (Branch de Producao)
- Proposito: Reflete o codigo que esta exatamente agora em producao.
- Regra de Ouro: E estritamente proibido fazer commits diretos na main.
- Como e atualizada: Recebe codigo exclusivamente atraves de Pull Requests (PRs) originados da branch dev.
- Deploy: Um merge na main deve disparar automaticamente (via CI/CD) o deploy para o ambiente de producao.

### 2. dev (Branch de Desenvolvimento)
- Proposito: E a nossa base unificada para desenvolvimento de novas features e correcoes. Serve como ambiente de integracao continua e homologacao.
- Regra de Ouro: Todas as novas funcionalidades e correcoes de bugs sao implementadas e commitadas diretamente nesta branch. Nao utilizamos branches efemeras (features/bugfixes) neste fluxo.
- Como e atualizada: Recebe commits diretos da equipe de desenvolvimento.

---

## Fluxo de Trabalho (Passo a Passo)

### 1. Sincronizacao Inicial
Antes de iniciar qualquer trabalho, garanta que sua versao local da dev esta atualizada com o trabalho do restante da equipe:
```bash
git checkout dev
git pull origin dev
```

### 2. Desenvolvimento e Commits
Realize o desenvolvimento da atividade diretamente na dev. Mantenha os commits semanticos, claros e atomicos.
```bash
git add .
git commit -m "feat: adiciona componente de Barra de Navegacao"
```
(Recomendamos o uso de Conventional Commits: feat:, fix:, chore:, refactor:, docs:)

### 3. Integracao Continua (Push para dev)
Assim que uma parte logica do trabalho estiver concluida e devidamente testada localmente, envie as alteracoes para o repositorio remoto:
```bash
git pull origin dev --rebase
git push origin dev
```
O uso do rebase antes do push e altamente recomendado para manter o historico linear e evitar commits de merge desnecessarios quando outros desenvolvedores tiverem atualizado a branch nesse meio tempo.

### 4. Lancamento em Producao (Pull Request para main)
Quando o conjunto de funcionalidades na dev esta estavel, validado e pronto para ser entregue aos usuarios:
1.  responsavel pelo release abre um Pull Request da dev apontando para a main.
2. O titulo do PR deve refletir o nome da alteracao a ser lancada (Ex: Release: Mudar navbar).
3. O corpo do PR deve conter um changelog com o resumo das features e correcoes que estao subindo para producao.
4. Solicitamos Code Review neste momento para garantir a integridade da entrega.
5. Apos a aprovacao e validacao da pipeline, realiza-se o merge na main.

---

## Boas Praticas
- Commits Pequenos e Frequentes: Como toda a equipe trabalha na mesma branch, commits grandes e demorados aumentam drasticamente a chance de conflitos complexos.
- Sincronia Constante: Faca git pull origin dev --rebase frequentemente. Quanto mais desatualizado seu repositorio local ficar, mais dolorosa sera a integracao com o trabalho dos colegas.
- Testes Locais Rigorosos: Como nao ha etapa de PR isolado por feature, garanta que seu codigo funciona perfeitamente (e passa nos testes) antes de dar o push na dev. Codigo quebrado na dev bloqueia toda a equipe.
- Integracao Ativa: O push para dev significa que o codigo esta pronto para ser testado em conjunto. Nao de push em codigo incompleto que quebre a compilacao do projeto.