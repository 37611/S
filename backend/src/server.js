const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Inicializa a conexão com o MongoDB e sobe o servidor HTTP
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` Servidor rodando em: http://localhost:${PORT}`);
      console.log(` Teste da API:       http://localhost:${PORT}/api`);
      console.log(` Endpoint Aparelhos: http://localhost:${PORT}/api/aparelhos`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
}

startServer();
