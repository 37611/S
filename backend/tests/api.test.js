/**
 * Testes automatizados para a API de Aparelhos Samsung
 * Pode ser executado com: node backend/tests/api.test.js
 */

const http = require('http');
const app = require('../src/app');
const mongoose = require('mongoose');
const Aparelho = require('../src/models/Aparelho');

// Helper para fazer requisições HTTP internas sem dependências externas
function makeRequest(server, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const postData = body ? JSON.stringify(body) : null;

    const options = {
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = data ? JSON.parse(data) : {};
        } catch (e) {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// Suíte de Testes
async function runTests() {
  console.log('--- INICIANDO TESTES DA API SAMSUNG ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASSOU] ${message}`);
      passed++;
    } else {
      console.error(`  [FALHOU] ${message}`);
      failed++;
    }
  }

  // Sobe um servidor HTTP temporário na porta 0 (porta livre aleatória)
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    // 1. Teste GET /api
    console.log('\n[1] Testando status da API (GET /api)');
    const resGetApi = await makeRequest(server, 'GET', '/api');
    assert(resGetApi.status === 200, `Status deve ser 200 (obtido: ${resGetApi.status})`);
    assert(
      resGetApi.data && resGetApi.data.mensagem === 'API de aparelhos Samsung funcionando.',
      'Mensagem deve ser "API de aparelhos Samsung funcionando."'
    );

    // 2. Teste GET /api/aparelhos/:id com ID inválido (formato não ObjectId)
    console.log('\n[2] Testando busca por ID inválido (GET /api/aparelhos/id-invalido)');
    const resIdInvalido = await makeRequest(server, 'GET', '/api/aparelhos/id-invalido');
    assert(resIdInvalido.status === 400, `Status deve ser 400 para ID inválido (obtido: ${resIdInvalido.status})`);
    assert(
      resIdInvalido.data.mensagem === 'ID informado é inválido.',
      'Mensagem deve indicar que o ID informado é inválido'
    );

    // 3. Teste POST /api/aparelhos com dados vazios/incompletos
    console.log('\n[3] Testando cadastro com dados incompletos (POST /api/aparelhos)');
    const resDadosIncompletos = await makeRequest(server, 'POST', '/api/aparelhos', {
      marca: 'Samsung',
      // modelo ausente
      preco: 1999.90,
      foto: 'https://exemplo.com/foto.jpg',
    });
    assert(resDadosIncompletos.status === 400, `Status deve ser 400 para modelo ausente (obtido: ${resDadosIncompletos.status})`);

    // 4. Teste POST /api/aparelhos com marca diferente de Samsung
    console.log('\n[4] Testando cadastro com marca não permitida (POST /api/aparelhos)');
    const resMarcaInvalida = await makeRequest(server, 'POST', '/api/aparelhos', {
      marca: 'Apple',
      modelo: 'iPhone 15',
      preco: 5000,
      foto: 'https://exemplo.com/iphone.jpg',
    });
    assert(resMarcaInvalida.status === 400, `Status deve ser 400 para marca diferente de Samsung (obtido: ${resMarcaInvalida.status})`);
    assert(
      resMarcaInvalida.data.mensagem.includes('Samsung'),
      'Mensagem deve informar que apenas aparelhos Samsung são permitidos'
    );

    // 5. Teste POST /api/aparelhos com preço inválido (negativo ou texto)
    console.log('\n[5] Testando cadastro com preço inválido (POST /api/aparelhos)');
    const resPrecoInvalido = await makeRequest(server, 'POST', '/api/aparelhos', {
      marca: 'Samsung',
      modelo: 'Galaxy S24',
      preco: -50,
      foto: 'https://exemplo.com/s24.jpg',
    });
    assert(resPrecoInvalido.status === 400, `Status deve ser 400 para preço negativo (obtido: ${resPrecoInvalido.status})`);

    // 6. Teste POST /api/aparelhos com URL de foto inválida
    console.log('\n[6] Testando cadastro com URL de foto inválida (POST /api/aparelhos)');
    const resFotoInvalida = await makeRequest(server, 'POST', '/api/aparelhos', {
      marca: 'Samsung',
      modelo: 'Galaxy S24',
      preco: 3999.90,
      foto: 'arquivo_local.jpg',
    });
    assert(resFotoInvalida.status === 400, `Status deve ser 400 para foto sem http/https (obtido: ${resFotoInvalida.status})`);

    // 7. Teste PUT com ID inválido
    console.log('\n[7] Testando atualização com ID inválido (PUT /api/aparelhos/123)');
    const resPutInvalido = await makeRequest(server, 'PUT', '/api/aparelhos/123', {
      modelo: 'Galaxy S24 Ultra',
    });
    assert(resPutInvalido.status === 400, `Status deve ser 400 para ID inválido no PUT (obtido: ${resPutInvalido.status})`);

    // 8. Teste DELETE com ID inválido
    console.log('\n[8] Testando exclusão com ID inválido (DELETE /api/aparelhos/123)');
    const resDeleteInvalido = await makeRequest(server, 'DELETE', '/api/aparelhos/123');
    assert(resDeleteInvalido.status === 400, `Status deve ser 400 para ID inválido no DELETE (obtido: ${resDeleteInvalido.status})`);

    // 9. Teste rota inexistente (404)
    console.log('\n[9] Testando rota não existente (GET /api/rota-inexistente)');
    const resRota404 = await makeRequest(server, 'GET', '/api/rota-inexistente');
    assert(resRota404.status === 404, `Status deve ser 404 (obtido: ${resRota404.status})`);
    assert(resRota404.data.mensagem === 'Rota não encontrada.', 'Mensagem de 404 esperada');

  } catch (err) {
    console.error('Erro durante os testes:', err);
    failed++;
  } finally {
    await new Promise((resolve) => server.close(resolve));
    console.log('\n===============================================');
    console.log(`RESULTADO DOS TESTES: ${passed} passaram, ${failed} falharam.`);
    console.log('===============================================');
  }
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
