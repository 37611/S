const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aparelhoRoutes = require('./routes/aparelhoRoutes');

const app = express();

// Configuração de Middlewares
app.use(
  cors({
    origin: '*', // Permite que o frontend em qualquer origem/porta acesse a API
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API montadas em /api
app.use('/api', aparelhoRoutes);

// Rota raiz para conveniência ou verificação de status
app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'Bem-vindo à API Samsung. Acesse /api para status ou /api/aparelhos para os recursos.',
  });
});

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    mensagem: 'Rota não encontrada.',
  });
});

// Middleware global de tratamento de erros (500)
app.use((err, req, res, next) => {
  console.error('Erro não tratado na aplicação:', err);
  res.status(500).json({
    mensagem: 'Erro interno no servidor.',
  });
});

module.exports = app;
