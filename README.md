# BananaPay Backend

<img src=".github/BananaPay.webp" alt="Logo do Projeto" width="400" />

Sistema de pagamentos via PIX desenvolvido com Node.js, TypeScript.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem principal
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **PostgreSQL** - Banco de dados (produção)
- **Zod** - Validação de dados
- **Jest** - Framework de testes
- **Winston** - Logging
- **Swagger** - Documentação da API

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd banana-pay-backend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp env.example .env
```

4. **Configure o banco de dados**

```bash
# Gera o cliente Prisma
npm run db:generate

# Executa as migrações
npm run db:migrate

# Popula o banco com dados de exemplo
npm run db:seed
```

5. **Inicie o servidor**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com as seguintes camadas:

```
src/
├── domain/           # Regras de negócio e entidades
├── application/      # Casos de uso
├── infrastructure/   # Implementações concretas
└── interface/        # Controllers e rotas
```

### Camadas

- **Domain**: Entidades, interfaces de repositórios e regras de negócio puras
- **Application**: Casos de uso que orquestram o domínio
- **Infrastructure**: Implementações de repositórios, banco de dados, etc.
- **Interface**: Controllers, rotas e DTOs

## 📚 API Endpoints

### Usuários

- `POST /api/v1/users` - Criar usuário
- `GET /api/v1/users` - Listar usuários
- `GET /api/v1/users/:id` - Buscar usuário
- `PUT /api/v1/users/:id` - Atualizar usuário
- `DELETE /api/v1/users/:id` - Remover usuário

### Contatos

- `POST /api/v1/contacts` - Criar contato
- `GET /api/v1/contacts` - Listar contatos
- `GET /api/v1/contacts/:id` - Buscar contato
- `GET /api/v1/contacts/user/:userId` - Buscar contatos por usuário
- `PUT /api/v1/contacts/:id` - Atualizar contato
- `DELETE /api/v1/contacts/:id` - Remover contato

### Transações

- `POST /api/v1/transactions` - Criar transação
- `GET /api/v1/transactions` - Listar transações
- `GET /api/v1/transactions/:id` - Buscar transação
- `GET /api/v1/transactions/user/:userId` - Buscar transações por usuário
- `POST /api/v1/transactions/:id/execute` - Executar transação
- `POST /api/v1/transactions/:id/cancel` - Cancelar transação

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo desenvolvimento
npm run build            # Compila o projeto
npm start                # Inicia servidor em produção

# Banco de dados
npm run db:generate      # Gera cliente Prisma
npm run db:migrate       # Executa migrações
npm run db:studio        # Abre Prisma Studio
npm run db:seed          # Popula banco com dados de exemplo

# Testes
npm test                 # Executa todos os testes
npm run test:watch       # Executa testes em modo watch
npm run test:unit        # Executa apenas testes unitários
npm run test:integration # Executa apenas testes de integração

# Linting
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige problemas do ESLint
```

## 🧪 Testes

```bash
# Executa todos os testes
npm test

# Executa testes com cobertura
npm run test -- --coverage

# Executa testes em modo watch
npm run test:watch
```

## 📖 Documentação

A documentação da API está disponível em:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração de CORS
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação**: Validação de entrada com Zod
- **Logging**: Logs estruturados com Winston

## 📊 Monitoramento

- **Logs**: Estruturados com Winston
- **Health Check**: Endpoint `/health`
- **Error Handling**: Middleware centralizado de tratamento de erros

## 🚀 Deploy

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## 📝 Exemplos de Uso

### Criar Usuário

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "12345678901"
  }'
```

### Criar Contato

```bash
curl -X POST http://localhost:3000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "name": "Mercado Central",
    "pixKeys": [
      {
        "key": "mercadocentral@example.com",
        "keyType": "EMAIL"
      }
    ]
  }'
```

### Criar Transação

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-id",
    "amount": 50.00,
    "description": "Compra no mercado",
    "pixKey": "mercadocentral@example.com",
    "pixKeyType": "EMAIL",
    "transactionType": "IMMEDIATE"
  }'
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Aleksander Palamar**

---

## 🎯 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar integração com APIs PIX reais
- [ ] Adicionar sistema de notificações
- [ ] Implementar dashboard administrativo
- [ ] Adicionar suporte a múltiplos bancos
- [ ] Implementar sistema de auditoria
