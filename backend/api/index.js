const app = require('../src/app');
const connectDB = require('../src/config/db');

/**
 * Handler serverless para a Vercel.
 * Garante que a conexão com o MongoDB esteja ativa antes de repassar a requisição ao Express.
 */
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Erro na conexão com MongoDB na Vercel:', error);
    return res.status(500).json({
      mensagem: 'Erro de conexão com o banco de dados na Vercel.',
    });
  }

  return app(req, res);
};
