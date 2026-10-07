# Mini Sistema — Gerenciamento de Aparelhos Samsung

Mini sistema web completo para cadastro e gerenciamento de aparelhos Samsung, composto por uma API REST em Node.js com Express e MongoDB (preparada para deploy serverless na Vercel) e um frontend responsivo e moderno em HTML5, CSS3 e JavaScript puro sem frameworks.

---

## 📁 Estrutura do Projeto

```text
www/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Conexão com MongoDB e cache de conexão serverless
│   │   ├── controllers/
│   │   │   └── aparelhoController.js# Lógica de controle do CRUD e validações
│   │   ├── models/
│   │   │   └── Aparelho.js          # Schema Mongoose com regras de negócio Samsung
│   │   ├── routes/
│   │   │   └── aparelhoRoutes.js    # Definição das rotas REST
│   │   ├── app.js                   # Configuração Express, CORS e Middlewares
│   │   └── server.js                # Inicialização do servidor local
│   ├── api/
│   │   └── index.js                 # Handler serverless para a Vercel
│   ├── tests/
│   │   └── api.test.js              # Testes automatizados da API
│   ├── package.json                 # Dependências e scripts npm
│   ├── vercel.json                  # Roteamento e configuração da Vercel
│   ├── .env                         # Variáveis de ambiente locais
│   └── .env.example                 # Exemplo de configuração de variáveis
│
├── frontend/
│   ├── index.html                   # Interface do usuário com modais e cards
│   ├── css/
│   │   └── style.css                # Estilização moderna e responsiva (CSS Puro)
│   └── js/
│       └── script.js                # Consumo da API (Fetch), formatação e interatividade
│
├── Roadmap.md                       # Checklist e plano de desenvolvimento
├── Contexto.md                      # Estado atualizado e especificações técnicas
├── api.md                           # Documentação oficial da API REST
└── README.md                        # Guia de execução e configuração
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (Ambiente de execução JavaScript)
- **Express** (Framework minimalista para rotas HTTP)
- **MongoDB** & **Mongoose** (Banco de dados NoSQL e modelagem de dados com validações)
- **dotenv** (Gerenciamento seguro de variáveis de ambiente)
- **CORS** (Permissão de requisições cross-origin para o frontend)
- **Vercel Serverless** (Deploy escalável na nuvem)

### Frontend
- **HTML5** (Estrutura semântica e acessível)
- **CSS3** (Estilização pura com variáveis CSS, CSS Grid e Flexbox responsivo)
- **JavaScript ES6+** (Consumo da API via `fetch`, manipulação do DOM e formatação em moeda BRL)

---

## ⚙️ Como Configurar o MongoDB

O sistema suporta tanto uma instância local do MongoDB quanto o MongoDB Atlas (nuvem):

### Opção 1: MongoDB Atlas (Recomendado para Deploy na Vercel)
1. Crie uma conta gratuita em [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Crie um cluster gratuito (M0 Sandbox).
3. Em **Database Access**, crie um usuário e senha.
4. Em **Network Access**, adicione a permissão para acesso de qualquer IP (`0.0.0.0/0`).
5. Copie a string de conexão (ex: `mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/samsung_db?retryWrites=true&w=majority`).
6. Cole a string na variável `MONGODB_URI` no arquivo `backend/.env`.

### Opção 2: MongoDB Local
1. Inicie seu serviço local do MongoDB.
2. No arquivo `backend/.env`, configure:
   ```env
   MONGODB_URI=mongodb://localhost:27017/samsung_db
   ```

---

## 🚀 Como Executar Localmente

### 1. Iniciar o Backend
```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor
npm start
```
O servidor iniciará em: **`http://localhost:3000`**

### 2. Abrir o Frontend
Basta abrir o arquivo `frontend/index.html` diretamente no seu navegador de preferência, ou através de uma extensão como **Live Server** no VS Code.

> **Nota:** A URL da API está centralizada na constante `const API_URL = "http://localhost:3000";` dentro do arquivo `frontend/js/script.js`.

---

## 🧪 Como Executar os Testes da API

Para rodar os testes automatizados da API:
```bash
cd backend
npm test
```
Ou teste as regras e schemas com o script de validação:
```bash
node test.js
```

---

## ☁️ Como Configurar o Deploy na Vercel

O projeto já inclui o arquivo `backend/vercel.json` e a função serverless `backend/api/index.js` configurados com reaproveitamento de conexão Mongoose (`cached.conn`).

1. Instale o Vercel CLI ou conecte seu repositório no painel da [Vercel](https://vercel.com).
2. Para fazer o deploy da pasta `backend`:
   ```bash
   cd backend
   vercel
   ```
3. No painel da Vercel, acesse **Settings > Environment Variables** e adicione:
   - `MONGODB_URI`: sua string de conexão do MongoDB Atlas.
4. Após o deploy, a API estará acessível em:
   `https://seu-projeto.vercel.app/api/aparelhos`
5. No arquivo `frontend/js/script.js`, atualize a constante `API_URL` com o endereço do seu deploy:
   ```javascript
   const API_URL = "https://seu-projeto.vercel.app";
   ```
