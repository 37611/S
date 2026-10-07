# Contexto do Projeto

## Objetivo

Sistema para gerenciamento e listagem de aparelhos Samsung. Permite realizar o CRUD completo de aparelhos (marca, modelo, preço e foto), com backend REST em Node.js/Express/MongoDB (preparado para Vercel) e frontend interativo em HTML5, CSS3 e JavaScript puro sem frameworks.

## Tecnologias

- **Node.js**: Ambiente de execução backend.
- **Express**: Framework web minimalista para a criação da API REST.
- **MongoDB**: Banco de dados NoSQL para persistência dos dados dos aparelhos.
- **Mongoose**: ODM para modelagem, validação de schema e comunicação com o MongoDB.
- **dotenv**: Carregamento seguro de variáveis de ambiente.
- **CORS**: Middleware para habilitar requisições cross-origin pelo frontend.
- **HTML5**: Estrutura semântica da interface com modais, cards e barra de ferramentas.
- **CSS3**: Estilização moderna com CSS Grid, Flexbox, variáveis e design responsivo.
- **JavaScript (Vanilla)**: Manipulação do DOM, Fetch API para comunicação com a API, formatação de moedas em BRL.
- **Vercel**: Plataforma de hospedagem serverless configurada para a API.

## Estrutura atual

```text
projeto-samsung/ (na pasta www/)
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Conexão MongoDB com cache serverless
│   │   ├── controllers/
│   │   │   └── aparelhoController.js# Funções de CRUD e validação de regras de negócio
│   │   ├── models/
│   │   │   └── Aparelho.js          # Schema Mongoose para aparelhos Samsung
│   │   ├── routes/
│   │   │   └── aparelhoRoutes.js    # Definição das rotas REST
│   │   ├── app.js                   # Configuração do Express, CORS e tratamento de erros
│   │   └── server.js                # Inicialização do servidor HTTP local
│   ├── api/
│   │   └── index.js                 # Handler Serverless Function para deploy na Vercel
│   ├── tests/
│   │   └── api.test.js              # Testes automatizados das rotas e validações
│   ├── package.json                 # Dependências e scripts do backend
│   ├── vercel.json                  # Roteamento e rewrites da Vercel
│   ├── .env                         # Variáveis de ambiente locais
│   └── .env.example                 # Exemplo documentado de variáveis necessárias
│
├── frontend/
│   ├── index.html                   # Página principal com visualização em cards e modais
│   ├── css/
│   │   └── style.css                # Estilização pura sem frameworks (responsiva)
│   └── js/
│       └── script.js                # Lógica da interface, Fetch API e formatação
│
├── .gitignore                       # Ignora node_modules e arquivos de ambiente (.env)
├── test.js                          # Script de validação unitária dos schemas e regras
├── Roadmap.md                       # Checklist completo do projeto
├── Contexto.md                      # Estado atualizado e especificações técnicas
├── api.md                           # Documentação oficial da API REST
└── README.md                        # Instruções completas de execução e deploy
```

## Backend

Totalmente implementado e configurado:
- Arquitetura MVC com separação em `src/controllers`, `src/models`, `src/routes`, `src/config`.
- `app.js`: Configura Express, middlewares de CORS aberto, `express.json()`, prefixo `/api` e handlers para 404 e 500.
- `server.js`: Inicialização de servidor HTTP local com porta configurável via `.env` (`PORT`).
- `controllers/aparelhoController.js`: Lógica do CRUD completa com respostas em JSON e códigos de status HTTP semânticos (200, 201, 400, 404, 500).
- `models/Aparelho.js`: Schema Mongoose com validações rigorosas:
  - Marca é obrigatória e deve ser "Samsung" (rejeita outras marcas).
  - Modelo é obrigatório (mínimo 2 caracteres).
  - Preço é obrigatório, numérico e maior que zero.
  - Foto é obrigatória e deve ser uma URL válida (http/https).
  - Timestamps (`createdAt`, `updatedAt`) ativados.
- `api/index.js` e `vercel.json`: Preparados para deploy serverless na Vercel com reaproveitamento de conexão.
- `tests/api.test.js`: Script de validação automática de rotas, códigos de status e regras de negócio.

## Banco de dados

MongoDB Atlas configurado via Mongoose com padrão de cache de conexão (`cached.conn`) para evitar estourar o limite de conexões simultâneas em ambientes serverless (Vercel) e garantir estabilidade em ambiente local.
- Conexão configurada para cluster na nuvem MongoDB Atlas (`cluster0.z4p0psn.mongodb.net`) com database `samsung_db`.
- Tratamento automático implementado em `src/config/db.js` para sanitização de marcadores de template `<>` caso inseridos acidentalmente.
- String de conexão configurada na variável de ambiente `MONGODB_URI` no arquivo `.env`.
- Arquivo `.env.example` mantido com template seguro.
- Arquivo `.gitignore` configurado garantindo que credenciais não sejam versionadas.

## Frontend

Totalmente implementado em pasta separada `frontend/`:
- **HTML5**: Estrutura semântica contendo cabeçalho institucional Samsung, barra de busca com contador dinâmico, estados de tela (carregando com spinner, lista vazia, erro com botão de repetição, grade de cards), modal de cadastro/edição com visualização de foto em tempo real e botões de preenchimento rápido (presets de teste), modal de confirmação de exclusão e container de toasts.
- **CSS3**: Estilos customizados e modernos sem dependência de Bootstrap ou outros frameworks. Paleta de cores inspirada na identidade Samsung, cards com layout responsivo (CSS Grid), efeito hover, tipografia limpa, suporte a telas móveis (media queries) e janelas modais com backdrop blur.
- **JavaScript**:
  - URL da API centralizada em `const API_URL = "http://localhost:3000";`.
  - Consumo completo da API REST utilizando `fetch()` (GET todos, GET por ID, POST, PUT, DELETE).
  - Formatação do preço recebido da API para moeda brasileira (`R$ 3.999,90`) usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
  - Tratamento de erros de carregamento, API indisponível, lista vazia, erro em imagens com imagem de fallback SVG.
  - Proteção contra XSS na renderização de dados dinâmicos.

## Endpoints

1. `GET /api` - Status e teste de funcionamento da API.
2. `GET /api/aparelhos` - Listagem de todos os aparelhos cadastrados.
3. `GET /api/aparelhos/:id` - Busca de aparelho individual por ID.
4. `POST /api/aparelhos` - Cadastro de novo aparelho Samsung.
5. `PUT /api/aparelhos/:id` - Atualização de aparelho existente por ID.
6. `DELETE /api/aparelhos/:id` - Exclusão de aparelho por ID.

## Variáveis de ambiente

- `PORT` - Porta do servidor backend local (padrão: 3000).
- `MONGODB_URI` - URI de conexão do MongoDB (ex: `mongodb://localhost:27017/samsung_db` ou string do MongoDB Atlas).

## Testes realizados

1. **Conexão Real com MongoDB Atlas e Servidor HTTP**:
   - Conexão com o cluster na nuvem MongoDB Atlas (`cluster0.z4p0psn.mongodb.net`) estabelecida com sucesso -> **Aprovado**.
   - Servidor HTTP Express iniciado com sucesso na porta 3000 (`http://localhost:3000`) -> **Aprovado**.
2. **Validação de Schemas e Regras de Negócio (`test.js`)**:
   - Dados válidos para Aparelho Samsung -> **Aprovado**.
   - Rejeição de marca diferente de Samsung (ex: Apple) -> **Aprovado** (rejeitado com mensagem apropriada).
   - Rejeição de preço negativo (-10) -> **Aprovado** (rejeitado com validação de mínimo).
   - Rejeição de URL de foto inválida (sem http/https) -> **Aprovado** (rejeitado com mensagem de URL obrigatória).
   - Rejeição de modelo e campos vazios -> **Aprovado**.
3. **Validação das Rotas e Respostas HTTP (`backend/tests/api.test.js`)**:
   - `GET /api`: Retorna status 200 e mensagem `"API de aparelhos Samsung funcionando."` -> **Aprovado**.
   - `GET /api/aparelhos/id-invalido`: Retorna status 400 com `"ID informado é inválido."` -> **Aprovado**.
   - `POST /api/aparelhos` (sem modelo): Retorna status 400 -> **Aprovado**.
   - `POST /api/aparelhos` (marca inválida): Retorna status 400 informando que apenas Samsung é permitida -> **Aprovado**.
   - `POST /api/aparelhos` (preço negativo): Retorna status 400 -> **Aprovado**.
   - `POST /api/aparelhos` (foto sem http): Retorna status 400 -> **Aprovado**.
   - `PUT /api/aparelhos/123`: Retorna status 400 para ID inválido -> **Aprovado**.
   - `DELETE /api/aparelhos/123`: Retorna status 400 para ID inválido -> **Aprovado**.
   - `GET /api/rota-inexistente`: Retorna status 404 e `"Rota não encontrada."` -> **Aprovado**.
4. **Validação do Frontend**:
   - Formatação de preços em moeda brasileira (Intl BRL) -> **Aprovado**.
   - Carregamento de imagens com política `referrerpolicy="no-referrer"` para desviar de bloqueios de CDN -> **Aprovado**.
   - Fallback de imagens com SVG de smartphone Samsung Galaxy com gradiente e logo -> **Aprovado**.
5. **Testes Reais em Produção na Vercel (`https://s-silk-psi.vercel.app`)**:
   - `GET /` -> Status 200 OK (Mensagem de boas-vindas da API) -> **Aprovado**.
   - `GET /api` -> Status 200 OK (`"API de aparelhos Samsung funcionando."`) -> **Aprovado**.
   - `GET /api/aparelhos` -> Status 200 OK (Retornando os 3 aparelhos cadastrados no MongoDB Atlas: Galaxy S24, Galaxy S24 Ultra e Galaxy A55) -> **Aprovado**.

## Deploy

- **URL de Produção da API na Vercel:** `https://s-silk-psi.vercel.app`
- Backend publicado e operando como Serverless Function com integração ao MongoDB Atlas via variável de ambiente `MONGODB_URI`.
- O frontend está configurado com `const API_URL = "https://s-silk-psi.vercel.app";` para consumir diretamente a API em nuvem.

## Pendências

- Nenhuma pendência. O projeto está 100% desenvolvido, testado e publicado com sucesso na Vercel e conectado ao MongoDB Atlas.
