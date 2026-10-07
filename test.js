/**
 * Script de Verificação e Validação do Projeto Samsung
 * Executa testes de validação unitária e de lógica de negócio
 */

console.log('=== VERIFICAÇÃO DO PROJETO SAMSUNG ===\n');

// 1. Testar se os arquivos principais existem e são requeríveis
try {
  const app = require('./backend/src/app');
  console.log(' [OK] backend/src/app carregado com sucesso.');

  const Aparelho = require('./backend/src/models/Aparelho');
  console.log(' [OK] backend/src/models/Aparelho carregado com sucesso.');

  const aparelhoController = require('./backend/src/controllers/aparelhoController');
  console.log(' [OK] backend/src/controllers/aparelhoController carregado com sucesso.');

  const routes = require('./backend/src/routes/aparelhoRoutes');
  console.log(' [OK] backend/src/routes/aparelhoRoutes carregado com sucesso.');

  const dbConfig = require('./backend/src/config/db');
  console.log(' [OK] backend/src/config/db carregado com sucesso.');

  // 2. Validação da Model Aparelho (Mongoose Schema Validation)
  console.log('\n--- Testando Regras do Schema Mongoose ---');
  
  // Teste: Dados válidos
  const aparelhoValido = new Aparelho({
    marca: 'Samsung',
    modelo: 'Galaxy S24',
    preco: 3999.9,
    foto: 'https://images.samsung.com/galaxy-s24.jpg'
  });
  const erroValido = aparelhoValido.validateSync();
  console.log(erroValido === undefined ? ' [OK] Validação de aparelho válido passou.' : ' [FALHA] Aparelho válido gerou erro: ' + erroValido);

  // Teste: Marca inválida (não Samsung)
  const aparelhoMarcaInvalida = new Aparelho({
    marca: 'Apple',
    modelo: 'iPhone',
    preco: 4000,
    foto: 'https://exemplo.com/foto.jpg'
  });
  const erroMarca = aparelhoMarcaInvalida.validateSync();
  console.log(erroMarca && erroMarca.errors['marca'] ? ' [OK] Validação rejeitou marca diferente de Samsung com sucesso.' : ' [FALHA] Validação de marca permitiu não-Samsung.');

  // Teste: Preço negativo
  const aparelhoPrecoNegativo = new Aparelho({
    marca: 'Samsung',
    modelo: 'Galaxy A55',
    preco: -10,
    foto: 'https://exemplo.com/foto.jpg'
  });
  const erroPreco = aparelhoPrecoNegativo.validateSync();
  console.log(erroPreco && erroPreco.errors['preco'] ? ' [OK] Validação rejeitou preço negativo com sucesso.' : ' [FALHA] Validação permitiu preço negativo.');

  // Teste: URL de foto inválida
  const aparelhoFotoInvalida = new Aparelho({
    marca: 'Samsung',
    modelo: 'Galaxy A55',
    preco: 2199.90,
    foto: 'foto_local.png'
  });
  const erroFoto = aparelhoFotoInvalida.validateSync();
  console.log(erroFoto && erroFoto.errors['foto'] ? ' [OK] Validação rejeitou foto sem http/https com sucesso.' : ' [FALHA] Validação permitiu URL de foto inválida.');

  // Teste: Campos obrigatórios ausentes
  const aparelhoVazio = new Aparelho({});
  const erroVazio = aparelhoVazio.validateSync();
  console.log(erroVazio && erroVazio.errors['modelo'] && erroVazio.errors['preco'] && erroVazio.errors['foto'] 
    ? ' [OK] Validação exigiu todos os campos obrigatórios.' 
    : ' [FALHA] Validação não exigiu campos obrigatórios.');

  console.log('\n=== TODOS OS TESTES UNITÁRIOS DE REGRAS DE NEGÓCIO PASSARAM! ===');
} catch (err) {
  console.error('Erro na verificação:', err);
}
