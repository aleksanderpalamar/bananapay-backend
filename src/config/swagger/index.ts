const PORT = process.env.PORT || 3000;

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "BananaPay API",
    version: "1.0.0",
    description: "Documentação da API BananaPay - Sistema de Pagamentos",
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
    "/pix/charges": {
      post: {
        tags: ["Pix"],
        summary: "Criar cobrança Pix",
        description:
          "Cria uma nova cobrança Pix através da API do Banco do Brasil",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  value: {
                    type: "number",
                    minimum: 0.01,
                    maximum: 1000000,
                    example: 150.5,
                    description: "Valor da cobrança em reais",
                  },
                  payerName: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "João Silva",
                    description: "Nome completo do pagador",
                  },
                  payerCpf: {
                    type: "string",
                    pattern: "^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$",
                    example: "123.456.789-00",
                    description: "CPF do pagador (com ou sem formatação)",
                  },
                  payerEmail: {
                    type: "string",
                    format: "email",
                    example: "joao@email.com",
                    description: "Email do pagador",
                  },
                  description: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                    example: "Pagamento de produto",
                    description: "Descrição da cobrança",
                  },
                  expirationMinutes: {
                    type: "number",
                    minimum: 1,
                    maximum: 43200,
                    example: 60,
                    description:
                      "Tempo de expiração em minutos (padrão: 60, máximo: 30 dias)",
                  },
                },
                required: [
                  "value",
                  "payerName",
                  "payerCpf",
                  "payerEmail",
                  "description",
                ],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Cobrança Pix criada com sucesso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiResponse",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
          },
          "401": {
            description: "Erro de autenticação com a API Pix",
          },
          "502": {
            description: "Erro na integração com a API Pix",
          },
        },
      },
      get: {
        tags: ["Pix"],
        summary: "Listar cobranças Pix por status",
        parameters: [
          {
            name: "status",
            in: "query",
            required: true,
            schema: {
              type: "string",
              enum: [
                "ATIVA",
                "CONCLUIDA",
                "REMOVIDA_PELO_USUARIO_RECEBEDOR",
                "REMOVIDA_PELO_PSP",
                "EXPIRADA",
              ],
            },
            example: "ATIVA",
          },
        ],
        responses: {
          "200": {
            description: "Lista de cobranças Pix encontradas",
          },
        },
      },
    },
    "/pix/charges/{txid}": {
      get: {
        tags: ["Pix"],
        summary: "Consultar cobrança Pix",
        parameters: [
          {
            name: "txid",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "TXID123456",
          },
        ],
        responses: {
          "200": {
            description: "Cobrança Pix encontrada com sucesso",
          },
          "404": {
            description: "Cobrança Pix não encontrada",
          },
        },
      },
      delete: {
        tags: ["Pix"],
        summary: "Cancelar cobrança Pix",
        parameters: [
          {
            name: "txid",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example: "TXID123456",
          },
        ],
        responses: {
          "200": {
            description: "Cobrança Pix cancelada com sucesso",
          },
          "404": {
            description: "Cobrança Pix não encontrada",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PixCharge: {
        type: "object",
        properties: {
          id: { type: "string" },
          txid: { type: "string" },
          locationUrl: { type: "string" },
          status: {
            type: "string",
            enum: [
              "ATIVA",
              "CONCLUIDA",
              "REMOVIDA_PELO_USUARIO_RECEBEDOR",
              "REMOVIDA_PELO_PSP",
              "EXPIRADA",
            ],
          },
          value: { type: "number" },
          payerName: { type: "string" },
          payerCpf: { type: "string" },
          payerEmail: { type: "string" },
          description: { type: "string" },
          expiresAt: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: { type: "object" },
          error: { type: "string" },
        },
      },
    },
  },
  tags: [
    {
      name: "Pix",
      description: "Operações relacionadas a cobranças Pix via Banco do Brasil",
    },
  ],
};
