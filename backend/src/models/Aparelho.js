const mongoose = require('mongoose');

const aparelhoSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'A marca é obrigatória.'],
      trim: true,
      default: 'Samsung',
      validate: {
        validator: function (v) {
          return typeof v === 'string' && /^samsung$/i.test(v.trim());
        },
        message: 'Este sistema aceita apenas aparelhos da marca Samsung.',
      },
    },
    modelo: {
      type: String,
      required: [true, 'O modelo é obrigatório.'],
      trim: true,
      minlength: [2, 'O modelo deve ter no mínimo 2 caracteres.'],
      maxlength: [100, 'O modelo deve ter no máximo 100 caracteres.'],
    },
    preco: {
      type: Number,
      required: [true, 'O preço é obrigatório.'],
      min: [0.01, 'O preço deve ser maior que zero.'],
    },
    foto: {
      type: String,
      required: [true, 'A URL da foto é obrigatória.'],
      trim: true,
      validate: {
        validator: function (v) {
          return typeof v === 'string' && /^https?:\/\/.+/i.test(v.trim());
        },
        message: 'A foto deve ser uma URL válida (começando com http:// ou https://).',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Formatação amigável para JSON (garante retorno de id limpo)
aparelhoSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

const Aparelho = mongoose.models.Aparelho || mongoose.model('Aparelho', aparelhoSchema);

module.exports = Aparelho;
