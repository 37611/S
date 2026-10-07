const mongoose = require('mongoose');

// Cache de conexão para reutilização em ambientes Serverless (Vercel) e local
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Conecta ao banco de dados MongoDB utilizando a URI definida no ambiente.
 * Reutiliza conexão ativa se disponível.
 */
async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('A variável de ambiente MONGODB_URI não foi configurada.');
  }

  // Sanitiza marcadores de template <usuario>:<senha> caso tenham sido mantidos
  uri = uri.trim().replace(/<([^>]+)>/g, '$1');

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('MongoDB conectado com sucesso.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }

  return cached.conn;
}

module.exports = connectDB;
