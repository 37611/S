# Documentação da API - Gerenciamento de Aparelhos Samsung

Esta é a documentação oficial da API REST desenvolvida em Node.js e Express para o gerenciamento de aparelhos da marca Samsung, com persistência no MongoDB e suporte a deploy serverless na Vercel.

---

## 1. Informações Gerais

- **URL Base Local:** `http://localhost:3000`
- **URL Base Produção (Vercel):** `https://s-silk-psi.vercel.app`
- **Prefixo dos Endpoints:** `/api`
- **Formato dos Dados:** `application/json`
- **Autenticação:** Não requerida nesta versão

---

## 2. Visão Geral dos Endpoints

| Método | Endpoint | Descrição | Códigos de Retorno |
| :--- | :--- | :--- | :--- |
| `GET` | `/api` | Verifica a integridade e status da API | 200 |
| `GET` | `/api/aparelhos` | Lista todos os aparelhos Samsung cadastrados | 200, 500 |
| `GET` | `/api/aparelhos/:id` | Busca um aparelho específico pelo ID | 200, 400, 404, 500 |
| `POST` | `/api/aparelhos` | Cadastra um novo aparelho Samsung | 201, 400, 500 |
| `PUT` | `/api/aparelhos/:id` | Atualiza os dados de um aparelho existente | 200, 400, 404, 500 |
| `DELETE` | `/api/aparelhos/:id` | Remove um aparelho do banco de dados | 200, 400, 404, 500 |

---

## 3. Detalhamento dos Endpoints

### 3.1. Teste de Funcionamento da API

- **Método:** `GET`
- **URL:** `/api`
- **Finalidade:** Verificar se a API está ativa e respondendo corretamente.
- **Parâmetros:** Nenhum.
- **Body:** Vazio.
- **Códigos HTTP:**
  - `200 OK`: API operacional.

#### Exemplo de Resposta (200 OK)
```json
{
  "mensagem": "API de aparelhos Samsung funcionando."
}
```

---

### 3.2. Listar Todos os Aparelhos

- **Método:** `GET`
- **URL:** `/api/aparelhos`
- **Finalidade:** Retornar a lista completa de aparelhos Samsung cadastrados, ordenados pelos mais recentes.
- **Parâmetros:** Nenhum.
- **Body:** Vazio.
- **Códigos HTTP:**
  - `200 OK`: Lista retornada com sucesso (array pode ser vazio caso não haja cadastros).
  - `500 Internal Server Error`: Falha de conexão ou erro no banco.

#### Exemplo de Resposta (200 OK)
```json
[
  {
    "id": "65b8c9e0123456789abcdef0",
    "marca": "Samsung",
    "modelo": "Galaxy S24",
    "preco": 3999.90,
    "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-sm-s921bzytzto-thumb-539299628",
    "createdAt": "2024-01-25T10:00:00.000Z",
    "updatedAt": "2024-01-25T10:00:00.000Z"
  },
  {
    "id": "65b8c9e0123456789abcdef1",
    "marca": "Samsung",
    "modelo": "Galaxy A55",
    "preco": 2199.90,
    "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/sm-a556elbgzto/gallery/br-galaxy-a55-5g-sm-a556-sm-a556elbgzto-thumb-540191834",
    "createdAt": "2024-01-24T14:30:00.000Z",
    "updatedAt": "2024-01-24T14:30:00.000Z"
  }
]
```

---

### 3.3. Buscar Aparelho por ID

- **Método:** `GET`
- **URL:** `/api/aparelhos/:id`
- **Finalidade:** Obter os detalhes completos de um aparelho específico.
- **Parâmetros de Rota:**
  - `id` (string, obrigatório): ID do MongoDB (ObjectId de 24 caracteres hexadecimais).
- **Body:** Vazio.
- **Códigos HTTP:**
  - `200 OK`: Aparelho encontrado.
  - `400 Bad Request`: Formato de ID inválido.
  - `404 Not Found`: Aparelho não encontrado para o ID informado.
  - `500 Internal Server Error`: Erro no servidor.

#### Exemplo de Resposta de Sucesso (200 OK)
```json
{
  "id": "65b8c9e0123456789abcdef0",
  "marca": "Samsung",
  "modelo": "Galaxy S24",
  "preco": 3999.90,
  "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-sm-s921bzytzto-thumb-539299628",
  "createdAt": "2024-01-25T10:00:00.000Z",
  "updatedAt": "2024-01-25T10:00:00.000Z"
}
```

#### Exemplo de Resposta para ID Inexistente (404 Not Found)
```json
{
  "mensagem": "Aparelho não encontrado."
}
```

#### Exemplo de Resposta para ID Inválido (400 Bad Request)
```json
{
  "mensagem": "ID informado é inválido."
}
```

---

### 3.4. Cadastrar Novo Aparelho

- **Método:** `POST`
- **URL:** `/api/aparelhos`
- **Finalidade:** Cadastrar um novo aparelho Samsung no sistema.
- **Headers:** `Content-Type: application/json`
- **Parâmetros:** Nenhum.
- **Regras de Validação:**
  - `marca`: Obrigatória, deve ser "Samsung" (padrão preenchido).
  - `modelo`: Obrigatório (mínimo 2 caracteres).
  - `preco`: Obrigatório, numérico e maior que zero.
  - `foto`: Obrigatória, URL válida iniciando com `http://` ou `https://`.
- **Códigos HTTP:**
  - `201 Created`: Aparelho criado com sucesso.
  - `400 Bad Request`: Dados inválidos ou campos obrigatórios ausentes.
  - `500 Internal Server Error`: Erro no servidor.

#### Exemplo de Body (Requisição)
```json
{
  "marca": "Samsung",
  "modelo": "Galaxy S24 Ultra",
  "preco": 6499.90,
  "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-ultra-sm-s928bztuzto-thumb-539308197"
}
```

#### Exemplo de Resposta (201 Created)
```json
{
  "id": "65b8c9e0123456789abcdef2",
  "marca": "Samsung",
  "modelo": "Galaxy S24 Ultra",
  "preco": 6499.90,
  "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-ultra-sm-s928bztuzto-thumb-539308197",
  "createdAt": "2024-01-26T12:00:00.000Z",
  "updatedAt": "2024-01-26T12:00:00.000Z"
}
```

#### Exemplo de Resposta para Marca Diferente de Samsung (400 Bad Request)
```json
{
  "mensagem": "Este sistema aceita apenas aparelhos da marca Samsung."
}
```

---

### 3.5. Atualizar Aparelho

- **Método:** `PUT`
- **URL:** `/api/aparelhos/:id`
- **Finalidade:** Atualizar dados de um aparelho existente.
- **Headers:** `Content-Type: application/json`
- **Parâmetros de Rota:**
  - `id` (string, obrigatório): ID do aparelho.
- **Body:** Campos que deseja atualizar (`modelo`, `preco`, `foto`).
- **Códigos HTTP:**
  - `200 OK`: Aparelho atualizado com sucesso.
  - `400 Bad Request`: Dados ou ID inválidos.
  - `404 Not Found`: Aparelho não encontrado.
  - `500 Internal Server Error`: Erro no servidor.

#### Exemplo de Body (Requisição)
```json
{
  "preco": 5999.00
}
```

#### Exemplo de Resposta (200 OK)
```json
{
  "id": "65b8c9e0123456789abcdef2",
  "marca": "Samsung",
  "modelo": "Galaxy S24 Ultra",
  "preco": 5999.00,
  "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-ultra-sm-s928bztuzto-thumb-539308197",
  "createdAt": "2024-01-26T12:00:00.000Z",
  "updatedAt": "2024-01-26T12:30:00.000Z"
}
```

---

### 3.6. Excluir Aparelho

- **Método:** `DELETE`
- **URL:** `/api/aparelhos/:id`
- **Finalidade:** Remover um aparelho do banco de dados.
- **Parâmetros de Rota:**
  - `id` (string, obrigatório): ID do aparelho a excluir.
- **Body:** Vazio.
- **Códigos HTTP:**
  - `200 OK`: Aparelho excluído com sucesso.
  - `400 Bad Request`: ID inválido.
  - `404 Not Found`: Aparelho não encontrado.
  - `500 Internal Server Error`: Erro no servidor.

#### Exemplo de Resposta (200 OK)
```json
{
  "mensagem": "Aparelho excluído com sucesso."
}
```

---

## 4. Exemplos de Utilização com Clientes HTTP

### 4.1. cURL

#### Testar API
```bash
curl -X GET http://localhost:3000/api
```

#### Listar Aparelhos
```bash
curl -X GET http://localhost:3000/api/aparelhos
```

#### Buscar por ID
```bash
curl -X GET http://localhost:3000/api/aparelhos/65b8c9e0123456789abcdef0
```

#### Cadastrar Aparelho
```bash
curl -X POST http://localhost:3000/api/aparelhos \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Samsung",
    "modelo": "Galaxy S24",
    "preco": 3999.90,
    "foto": "https://images.samsung.com/is/image/samsung/p6pim/br/2401/gallery/br-galaxy-s24-sm-s921bzytzto-thumb-539299628"
  }'
```

#### Atualizar Aparelho
```bash
curl -X PUT http://localhost:3000/api/aparelhos/65b8c9e0123456789abcdef0 \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 3799.00
  }'
```

#### Excluir Aparelho
```bash
curl -X DELETE http://localhost:3000/api/aparelhos/65b8c9e0123456789abcdef0
```

---

### 4.2. Postman e Insomnia

1. Crie uma nova Collection chamada **Samsung Devices API**.
2. Defina uma variável de ambiente `baseUrl` com o valor `http://localhost:3000`.
3. Crie as requisições configurando os cabeçalhos (`Content-Type: application/json` no POST e PUT) e aponte para `{{baseUrl}}/api/aparelhos`.
