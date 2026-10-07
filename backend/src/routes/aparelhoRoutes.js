const express = require('express');
const router = express.Router();
const aparelhoController = require('../controllers/aparelhoController');

// Teste da API
router.get('/', aparelhoController.testarApi);

// CRUD de Aparelhos
router.get('/aparelhos', aparelhoController.listarAparelhos);
router.get('/aparelhos/:id', aparelhoController.buscarAparelhoPorId);
router.post('/aparelhos', aparelhoController.cadastrarAparelho);
router.put('/aparelhos/:id', aparelhoController.atualizarAparelho);
router.delete('/aparelhos/:id', aparelhoController.excluirAparelho);

module.exports = router;
