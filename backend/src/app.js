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

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API montadas em /api
app.use('/api', aparelhoRoutes);

// Rota raiz entrega o frontend (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
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
