const PORT = process.env.PORT || 3000;

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "BananaPay API",
    version: "1.0.0",
    description: "API para sistema de pagamentos via PIX",
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api/v1`,
      description: "Versão 1 da API",
    },
  ],
  paths: {
    "/users": {
      post: {
        summary: "Criar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  cpf: { type: "string" },
                },
                required: ["name", "email", "cpf"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário criado com sucesso",
          },
        },
      },
      get: {
        summary: "Listar usuários",
        responses: {
          "200": {
            description: "Lista de usuários",
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Buscar usuário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Usuário encontrado",
          },
        },
      },
      put: {
        summary: "Atualizar usuário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário atualizado com sucesso",
          },
        },
      },
      delete: {
        summary: "Remover usuário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "204": {
            description: "Usuário removido com sucesso",
          },
        },
      },
    },
    "/contacts": {
      post: {
        summary: "Criar contato",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  userId: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                },
                required: ["userId", "name", "email"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Contato criado com sucesso",
          },
        },
      },
      get: {
        summary: "Listar contatos",
        responses: {
          "200": {
            description: "Lista de contatos",
          },
        },
      },
    },
    "/contacts/{id}": {
      get: {
        summary: "Buscar contato",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Contato encontrado",
          },
        },
      },
      put: {
        summary: "Atualizar contato",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Contato atualizado com sucesso",
          },
        },
      },
      delete: {
        summary: "Remover contato",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "204": {
            description: "Contato removido com sucesso",
          },
        },
      },
    },
    "/contacts/user/{userId}": {
      get: {
        summary: "Buscar contatos por usuário",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Contatos encontrados",
          },
        },
      },
    },
    "/transactions": {
      post: {
        summary: "Criar transação",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  payerId: { type: "string" },
                  receiverId: { type: "string" },
                  amount: { type: "number" },
                },
                required: ["payerId", "receiverId", "amount"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Transação criada com sucesso",
          },
        },
      },
      get: {
        summary: "Listar transações",
        responses: {
          "200": {
            description: "Lista de transações",
          },
        },
      },
    },
    "/transactions/{id}": {
      get: {
        summary: "Buscar transação",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Transação encontrada",
          },
        },
      },
    },
    "/transactions/user/{userId}": {
      get: {
        summary: "Buscar transações por usuário",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Transações encontradas",
          },
        },
      },
    },
    "/transactions/{id}/execute": {
      post: {
        summary: "Executar transação",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Transação executada com sucesso",
          },
        },
      },
    },
    "/transactions/{id}/cancel": {
      post: {
        summary: "Cancelar transação",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Transação cancelada com sucesso",
          },
        },
      },
    },
  },
};