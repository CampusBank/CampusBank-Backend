# 🏦 CampusBank
## _Aplicação de Simulação de Transações Pix Seguras_

[![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

O **CampusBank** é uma aplicação voltada para simular transações **Pix** seguras entre usuários.  
Conta com autenticação via **JWT**, controle de **score de confiança**, criação e verificação de **chaves Pix**, e um módulo de **denúncias** para aumentar a segurança das transações.

---

## ⚙️ Funcionalidades

- 👤 Cadastro e login de usuários com autenticação JWT  
- 💳 Criação e validação de chaves Pix  
- 💸 Envio de transações Pix entre usuários  
- 🚨 Sistema de denúncias com penalização automática no score  
- 🧾 Listagem de transações enviadas e recebidas  
- 🔐 Middleware de segurança e controle de acesso por função (usuário/admin)

---

## 🧠 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/) — Ambiente de execução do servidor  
- [Express.js](https://expressjs.com/) — Framework para criação de rotas e APIs  
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — Banco de dados e ODM  
- [jsonwebtoken](https://jwt.io/) — Autenticação baseada em token  
- [dotenv](https://www.npmjs.com/package/dotenv) — Gerenciamento de variáveis de ambiente  
- [Helmet](https://helmetjs.github.io/) — Segurança nas requisições HTTP  

---

## 🚀 Como Rodar o Projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seuusuario/campusbank-backend.git
cd campusbank-backend
```

### 2️⃣ Instalar as dependências
```bash
npm install
```

### 3️⃣ Criar o arquivo .env
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```bash
CONNECTIONSTRING=sua_string_de_conexao_mongodb
JWT_SECRET=seu_token_secreto
```

### 4️⃣ Rodar o servidor
```bash
npm start
```
---

### 📦 Estrutura de Pastas
```
campusbank-backend/
│
├── src/
│   ├── controllers/
│   │   ├── UserController.js
│   │   ├── PixController.js
│   │   └── DenController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Denuncia.js
│   │
│   │ 
│   ├─ routes.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---
## 🚀 Funcionalidades Principais

O **CampusBank Backend** é a API responsável por gerenciar usuários, transações Pix, denúncias e autenticação com JWT.

### 🔐 Autenticação e Usuários

| Método | Rota | Descrição |
|--------|------|------------|
| `POST` | `/cadastro` | Cadastra um novo usuário |
| `POST` | `/login` | Faz login e retorna o token JWT |
| `GET` | `/perfil` | Retorna os dados do usuário autenticado |
| `GET` | `/listarUsuarios` | Lista todos os usuários (somente admin) |

---

### 💸 Transações Pix

| Método | Rota | Descrição |
|--------|------|------------|
| `POST` | `/criarTransacao` | Envia uma transação Pix |
| `GET` | `/listTransaction` | Lista todas as transações enviadas e recebidas do usuário |
| `POST` | `/checkKey` | Verifica se uma chave Pix existe e retorna informações do dono |

#### 🧾 Exemplo de JSON - Criar Transação
```json
{
  "pixType": "cpf",
  "pixKey": "12345678900",
  "valor": 150.00
}
```

---
### 🚨 Denúncias

| Método | Rota | Descrição |
|--------|------|------------|
| `POST` | `/criarDenuncia` | Cria uma denúncia de uma transação |
| `GET` | `/listarDenuncias` | Lista todas as denúncias (somente admin) |
| `PUT` | `/atualizarDenuncia` | Atualiza o status da denúncia e ajusta o score do usuário denunciado |

#### 🧾 Exemplo de JSON - Atualizar Denúncia
```json
{
  "idDenun": "672b9f8e09b3a123c8e1d45e",
  "status": "aceita"
}
```

---

### 🧠 Middlewares

|Nome |	Função|
|--------|------------|
|authToken |	Verifica o token JWT e autentica o usuário|
|isAdm | Verifica se o usuário autenticado possui o papel admin|
---
### 🧩 Modelos (Mongoose)
```bash
📄 User.js
{
  nome: String,
  email: String,
  password: String,
  score: { type: Number, default: 100 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  pixKey: [{ key: String, type: String }]
}

📄 Transaction.js
{
  sender: { type: ObjectId, ref: 'User' },
  receiver: { type: ObjectId, ref: 'User' },
  pixType: { type: String, enum: ['email', 'cpf', 'telefone', 'aleatoria'] },
  pixKey: String,
  valor: Number,
  status: { type: String, enum: ['pendente', 'concluida', 'falhou'], default: 'pendente' }
}

📄 Denuncia.js
{
  usuario: { type: ObjectId, ref: 'User' },
  transacao: { type: ObjectId, ref: 'Transaction' },
  motivo: String,
  status: { type: String, enum: ['pendente', 'aceita', 'recusada'], default: 'pendente' }
}
```
---

### ⚖️ Regras de Negócio

- Todo usuário inicia com score = 100
- Denúncias aceitas reduzem o score do denunciado em 20 pontos
- Usuários com score menor que 50 são considerados não confiáveis
- Somente administradores podem aceitar ou recusar denúncias
- Usuários comuns só podem criar denúncias e ver suas próprias transações

---

### 🔄 Fluxo do Sistema

- 👤 O usuário cria uma conta e realiza login.
- 💳 Cria ou vincula suas chaves Pix (CPF, e-mail, telefone ou aleatória).
- 💸 Realiza uma transação Pix utilizando uma chave válida.
- 🚨 Caso identifique comportamento suspeito, o usuário pode denunciar a transação.
- 🧑‍💼 O administrador revisa as denúncias e decide aceitar ou recusar.
- ⚖️ Se aceita, o score do usuário denunciado é reduzido automaticamente.

---

### 🧰 Ferramentas de Teste

- Thunder Client ou Postman para testar as rotas da API
-  Autenticação via Header:
```bash
Authorization: Bearer <seu_token_jwt>
```

---
### 🧑‍💻 Autores

Desenvolvido por **Richard V.**
📚 Projeto acadêmico desenvolvido para a disciplina de **Segurança** e **Criptografia**
🏫 **UNIFG** — **CampusBank**
