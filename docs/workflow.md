# Documentacao de Workflows e CI/CD (Sportfind)

## Visao Geral
Este documento descreve os fluxos de automacao (Pipelines de CI/CD) estabelecidos para o projeto Sportfind. 
Nosso objetivo e garantir a qualidade do codigo, automacao de testes e deploys confiaveis, suportando a nossa estrategia de Git Flow direto (onde o desenvolvimento ocorre ativamente na branch `dev` e os releases sao promovidos para a `main`).

---

## Gatilhos e Pipelines

Atualmente, possuimos duas pipelines principais configuradas no Github Actions (localizadas em `.github/workflows/`):

### 1. Workflow de Desenvolvimento e Integracao Continua (dev.yml)
- Escopo: Validar a integridade de todas as novas adicoes ao codigo.
- Gatilho (Trigger): Este workflow e acionado automaticamente a cada evento de `push` direto na branch `dev`.
- Responsabilidades do Workflow:
  1. Setup de Ambiente: Prepara o ambiente Node.js com a versao estabelecida para o projeto.
  2. Instalacao de Dependencias: Executa `npm install` (ou `npm ci` para garantir determinismo, se o lockfile for estrito).
  3. Verificacao de Qualidade Estatica (Lint): Roda os linters configurados (ESLint) para garantir a consistencia e padronizacao do codigo.
  4. Execucao de Testes: Roda a suite de testes unitarios e de integracao via Jest (`npm test`).
  5. Relatorio de Cobertura: Gera e publica o coverage de codigo.
- Importancia: Como adotamos o commit direto na `dev`, esta pipeline atua como o principal fiscal de saude do repositorio. Uma quebra neste workflow indica que o ambiente de desenvolvimento de toda a equipe esta comprometido e requer correcao imediata ("Stop the Line").

### 2. Workflow de Producao e Deploy (main.yml)
- Escopo: Preparar e realizar a entrega do software para o ambiente de producao.
- Gatilho (Trigger): Este workflow e acionado exclusivamente por eventos de `push` na branch `main` (que ocorrem exclusivamente via aprovacao de Pull Requests da `dev` para a `main`).
- Responsabilidades do Workflow:
  1. Setup de Ambiente e Validacao: Replica os passos do `dev.yml` (setup, instalacao, lint e testes) para garantir que nenhuma integracao final tenha quebrado o codigo.
  2. Build de Producao: Executa os comandos de compilacao e geracao dos artefatos finais minimizados do aplicativo/servidor.
  3. Artefatos de Deploy: Gera a versao final da API (backend) ou do aplicativo (Expo/React Native) pronta para consumo.
  4. (Opcional/A Implementar) Deploy Continuo: Aciona os servicos de hospedagem ou lojas de aplicativos para publicacao automatica.
- Importancia: Garante que apenas versoes estaveis, validadas pela bateria completa de testes e empacotadas para maxima performance, cheguem aos usuarios finais.

---

## Estrategia de Resiliencia da Pipeline

Para suportar o fluxo de commits diretos na branch `dev`, os desenvolvedores devem aderir as seguintes praticas relacionadas aos workflows:

1. Execucao Local Previa:
   O desenvolvedor deve executar localmente os scripts de validacao (`npm run lint` e `npm test`) antes de qualquer push. Falhar a pipeline remota com erros de formatacao basica ou testes simples gera ruidos e atrasa o restante da equipe.

2. Politica "Build Quebrado e Prioridade Zero":
   Se a pipeline `dev.yml` falhar apos um push, a correcao imediata desse erro torna-se a prioridade absoluta. Nenhum novo push deve ser feito (exceto a correcao) ate que a branch retorne ao estado "verde" (passing).

3. Code Review como Porta de Entrada para Producao:
   Como a pipeline `main.yml` e acionada apenas via Pull Request aprovado, os revisores tem a responsabilidade de verificar os resultados da aba de actions do Github associados ao ultimo commit da `dev`, garantindo que apenas codigo totalmente validado siga adiante.

4. Secrets e Variaveis de Ambiente:
   Nunca comite credenciais (ex: tokens de acesso a bancos de dados, chaves de APIs). Todas as credenciais necessarias para os testes no workflow devem estar estritamente configuradas como `Secrets` no Github Actions e populadas nos ambientes virtuais das pipelines.