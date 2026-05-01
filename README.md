# Sportfind

Aplicativo Expo + React Native para descobrir locais esportivos no mapa, buscar por nome e filtrar por tipo/acesso.

## Requisitos

- Node.js 18+ (recomendado LTS)
- npm 9+
- Expo CLI (opcional, mas recomendado): `npm install -g expo-cli`

## Instalação

```bash
npm install
```

## Execução

- `npm start`: inicia o Expo Dev Server
- `npm run web`: abre versão web
- `npm run android`: abre no Android (emulador/dispositivo)
- `npm run ios`: abre no iOS (macOS)

## Qualidade de código

- `npm run lint`: valida padrão de código
- `npm run format`: formata o projeto com Prettier
- `npm test`: executa testes unitários/regressão

## Estrutura do projeto

- `App.js`: ponto de entrada com providers globais
- `src/navigation`: navegação principal (tabs + stack)
- `src/state`: estado global da aplicação (busca, filtros e local selecionado)
- `src/domain/places`: domínio de locais (dados, filtros, seletores e adapters)
- `src/features/map`: integração do mapa e bridge de mensagens
- `src/screens`: telas do app
- `src/components`: componentes visuais reutilizáveis
- `src/data`: camada de compatibilidade com estrutura legada
- `style`: tokens de design e estilos por feature
- `__tests__`: testes automatizados

## Fluxo principal da aplicação

1. A tela de mapa renderiza os locais disponíveis.
2. O clique no marcador seleciona um local via bridge (web/native).
3. O usuário pode abrir busca e aplicar filtros.
4. Ao selecionar um item, a navegação abre a tela de detalhes do local.

## Arquitetura (resumo)

- Navegação com React Navigation:
  - tabs para seções principais
  - stack da área de mapa (`TelaMapa`, `TelaBusca`, `TelaLocal`)
- Estado centralizado em `src/state/AppStateContext.js`.
- Regras de filtro em `src/domain/places/selectors.js`.
- Geração HTML do mapa encapsulada em `src/features/map/createMapHtml.js`.

## Testes atuais

- `__tests__/selectors.test.js`: valida comportamento dos filtros de domínio.
- `__tests__/mapBridge.test.js`: valida contrato de mensagens do mapa.

## Convenções adotadas

- Separação por camadas (`domain`, `features`, `navigation`, `state`, `screens`).
- Tokens visuais centralizados em `style/tokens.js`.
- Evitar lógica de negócio em componentes visuais.
- Manter adapters de compatibilidade em `src/data` durante migrações graduais.

## Problemas comuns

- Erro de dependências após atualizar pacotes:
  - remova `node_modules` e `package-lock.json`
  - rode `npm install` novamente
- Metro/Expo com cache antigo:
  - execute `npx expo start -c`
- Web sem renderizar mapa:
  - verifique conexão (Leaflet CDN é carregado externamente)

## Próximos passos sugeridos

- Cobrir fluxo de navegação com testes de integração (screen-level).
- Finalizar telas `Login` e `Cadastro` (atualmente vazias).
- Adicionar CI para `lint` + `test` em pull requests.

## Backend

O projeto possui um backend Node.js + Express em `src/backend`.

### Estrutura dos arquivos do backend

- `src/api_backend/server.js`:inicializa o servidor Express
- `src/api_backend/routes/UsuarioRoute.js`: define os endpoints da API de usuário
- `src/api_backend/controllers/UsuarioController.js`: recebe `req` e `res` das rotas
- `src/api_backend/services/UsuarioService.js`: camada intermediária entre controller e model
- `src/api_backend/models/Usuario.js`: executa integração direta com Firebase

### Fluxo de cadastro e login

1. O app envia requisição para as rotas `/usuario` ou `/usuario/login`.
2. A rota chama o método correspondente no `UsuarioController`.
3. O controller delega para o `UsuarioService`.
4. O serviço chama o `Usuario` model.
5. O model integra com Firebase e devolve o resultado para resposta da API.