const mongoose = require('mongoose');
const Aparelho = require('../models/Aparelho');

/**
 * Controller responsável pelas operações da API de Aparelhos Samsung
 */

// GET /api
const testarApi = (req, res) => {
  return res.status(200).json({
    mensagem: 'API de aparelhos Samsung funcionando.',
  });
};

// GET /api/aparelhos
const listarAparelhos = async (req, res) => {
  try {
    const aparelhos = await Aparelho.find().sort({ createdAt: -1 });
    return res.status(200).json(aparelhos);
  } catch (error) {
    console.error('Erro ao listar aparelhos:', error);
    return res.status(500).json({
      mensagem: 'Erro interno ao consultar aparelhos.',
    });
  }
};

// GET /api/aparelhos/:id
const buscarAparelhoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensagem: 'ID informado é inválido.',
      });
    }

    const aparelho = await Aparelho.findById(id);

    if (!aparelho) {
      return res.status(404).json({
        mensagem: 'Aparelho não encontrado.',
      });
    }

    return res.status(200).json(aparelho);
  } catch (error) {
    console.error('Erro ao buscar aparelho por ID:', error);
    return res.status(500).json({
      mensagem: 'Erro interno ao buscar aparelho.',
    });
  }
};

// POST /api/aparelhos
const cadastrarAparelho = async (req, res) => {
  try {
    const { marca, modelo, preco, foto } = req.body;

    // Validação de campos obrigatórios
    if (!modelo || typeof modelo !== 'string' || modelo.trim().length === 0) {
      return res.status(400).json({
        mensagem: 'O modelo é obrigatório.',
      });
    }

    if (preco === undefined || preco === null || preco === '') {
      return res.status(400).json({
        mensagem: 'O preço é obrigatório.',
      });
    }

    const precoNumerico = Number(preco);
    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      return res.status(400).json({
        mensagem: 'O preço deve ser um número válido e maior que zero.',
      });
    }

    if (!foto || typeof foto !== 'string' || !foto.trim().match(/^https?:\/\/.+/i)) {
      return res.status(400).json({
        mensagem: 'A foto é obrigatória e deve ser uma URL válida (http:// ou https://).',
      });
    }

    // Validação específica da marca Samsung
    const marcaFinal = marca && typeof marca === 'string' ? marca.trim() : 'Samsung';
    if (!/^samsung$/i.test(marcaFinal)) {
      return res.status(400).json({
        mensagem: 'Este sistema aceita apenas aparelhos da marca Samsung.',
      });
    }

    const novoAparelho = await Aparelho.create({
      marca: 'Samsung',
      modelo: modelo.trim(),
      preco: precoNumerico,
      foto: foto.trim(),
    });

    return res.status(201).json(novoAparelho);
  } catch (error) {
    console.error('Erro ao cadastrar aparelho:', error);

    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        mensagem: mensagens.join(' '),
      });
    }

    return res.status(500).json({
      mensagem: 'Erro interno ao cadastrar aparelho.',
    });
  }
};

// PUT /api/aparelhos/:id
const atualizarAparelho = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensagem: 'ID informado é inválido.',
      });
    }

    const { marca, modelo, preco, foto } = req.body;
    const dadosParaAtualizar = {};

    if (modelo !== undefined) {
      if (typeof modelo !== 'string' || modelo.trim().length === 0) {
        return res.status(400).json({
          mensagem: 'O modelo não pode ser vazio.',
        });
      }
      dadosParaAtualizar.modelo = modelo.trim();
    }

    if (preco !== undefined) {
      const precoNumerico = Number(preco);
      if (isNaN(precoNumerico) || precoNumerico <= 0) {
        return res.status(400).json({
          mensagem: 'O preço deve ser um número válido e maior que zero.',
        });
      }
      dadosParaAtualizar.preco = precoNumerico;
    }

    if (foto !== undefined) {
      if (typeof foto !== 'string' || !foto.trim().match(/^https?:\/\/.+/i)) {
        return res.status(400).json({
          mensagem: 'A foto deve ser uma URL válida (http:// ou https://).',
        });
      }
      dadosParaAtualizar.foto = foto.trim();
    }

    if (marca !== undefined) {
      if (typeof marca !== 'string' || !/^samsung$/i.test(marca.trim())) {
        return res.status(400).json({
          mensagem: 'Este sistema aceita apenas aparelhos da marca Samsung.',
        });
      }
      dadosParaAtualizar.marca = 'Samsung';
    }

    const aparelhoAtualizado = await Aparelho.findByIdAndUpdate(
      id,
      dadosParaAtualizar,
      { new: true, runValidators: true }
    );

    if (!aparelhoAtualizado) {
      return res.status(404).json({
        mensagem: 'Aparelho não encontrado.',
      });
    }

    return res.status(200).json(aparelhoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar aparelho:', error);

    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        mensagem: mensagens.join(' '),
      });
    }

    return res.status(500).json({
      mensagem: 'Erro interno ao atualizar aparelho.',
    });
  }
};

// DELETE /api/aparelhos/:id
const excluirAparelho = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensagem: 'ID informado é inválido.',
      });
    }

    const aparelhoExcluido = await Aparelho.findByIdAndDelete(id);

    if (!aparelhoExcluido) {
      return res.status(404).json({
        mensagem: 'Aparelho não encontrado.',
      });
    }

    return res.status(200).json({
      mensagem: 'Aparelho excluído com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao excluir aparelho:', error);
    return res.status(500).json({
      mensagem: 'Erro interno ao excluir aparelho.',
    });
  }
};

module.exports = {
  testarApi,
  listarAparelhos,
  buscarAparelhoPorId,
  cadastrarAparelho,
  atualizarAparelho,
  excluirAparelho,
};
