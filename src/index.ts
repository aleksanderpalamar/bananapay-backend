import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

// Carrega as variáveis de ambiente
dotenv.config();

// Importações da aplicação
import {
  getPrismaClient,
  closeDatabase,
} from "./infrastructure/config/database";
import logger from "./infrastructure/config/logger";
import { errorHandler } from "./infrastructure/middleware/errorHandler";
import { rateLimiter } from "./infrastructure/middleware/rateLimiter";
import { requestLogger } from "./infrastructure/middleware/requestLogger";

// Importações dos repositórios
import { PrismaUserRepository } from "./infrastructure/database/PrismaUserRepository";
import { PrismaContactRepository } from "./infrastructure/database/PrismaContactRepository";
import { PrismaTransactionRepository } from "./infrastructure/database/PrismaTransactionRepository";

// Importações dos casos de uso
import { CreateUserUseCase } from "./application/use-cases/CreateUserUseCase";
import { CreateContactUseCase } from "./application/use-cases/CreateContactUseCase";
import { CreateTransactionUseCase } from "./application/use-cases/CreateTransactionUseCase";
import { CreatePixChargeUseCase } from "./application/use-cases/CreatePixChargeUseCase";

// Importações dos serviços
import { BancoDoBrasilPixService } from "./infrastructure/services/BancoDoBrasilPixService";

// Importações dos controllers
import { UserController } from "./interface/controllers/UserController";
import { ContactController } from "./interface/controllers/ContactController";
import { TransactionController } from "./interface/controllers/TransactionController";
import { PixController } from "./interface/controllers/PixController";

// Importações das rotas
import { createUserRoutes } from "./interface/routes/userRoutes";
import { createContactRoutes } from "./interface/routes/contactRoutes";
import { createTransactionRoutes } from "./interface/routes/transactionRoutes";
import { createPixRoutes } from "./interface/routes/pixRoutes";
import { swaggerDocument } from "./config/swagger";

/**
 * Configuração do servidor Express
 */
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware de segurança e parsing
 */
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware de logging e rate limiting
 */
app.use(requestLogger);
app.use(rateLimiter);

/**
 * Configuração do Swagger
 */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Rota de health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Configuração das dependências
 */
const prisma = getPrismaClient();

// Repositórios
const userRepository = new PrismaUserRepository(prisma);
const contactRepository = new PrismaContactRepository(prisma);
const transactionRepository = new PrismaTransactionRepository(prisma);

// Serviços
const pixService = new BancoDoBrasilPixService();

// Casos de uso
const createUserUseCase = new CreateUserUseCase(userRepository);
const createContactUseCase = new CreateContactUseCase(
  contactRepository,
  userRepository
);
const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository,
  userRepository
);
const createPixChargeUseCase = new CreatePixChargeUseCase(pixService);

// Controllers
const userController = new UserController(createUserUseCase);
const contactController = new ContactController(createContactUseCase);
const transactionController = new TransactionController(
  createTransactionUseCase
);
const pixController = new PixController(createPixChargeUseCase, pixService);

/**
 * Configuração das rotas da API
 */
app.use("/api/v1/users", createUserRoutes(userController));
app.use("/api/v1/contacts", createContactRoutes(contactController));
app.use("/api/v1/transactions", createTransactionRoutes(transactionController));
app.use("/api/v1/pix", createPixRoutes(pixController));

/**
 * Middleware de tratamento de erros
 */
app.use(errorHandler);

/**
 * Rota para requisições não encontradas
 */
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
  });
});

/**
 * Inicialização do servidor
 */
async function startServer(): Promise<void> {
  try {
    // Testa a conexão com o banco de dados
    await prisma.$connect();
    logger.info("Conexão com banco de dados estabelecida");

    // Inicia o servidor
    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
      logger.info(
        `Documentação disponível em: http://localhost:${PORT}/api-docs`
      );
      logger.info(`Health check em: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

/**
 * Tratamento de sinais para graceful shutdown
 */
process.on("SIGINT", async () => {
  logger.info("Recebido SIGINT, encerrando servidor...");
  await closeDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Recebido SIGTERM, encerrando servidor...");
  await closeDatabase();
  process.exit(0);
});

/**
 * Tratamento de erros não capturados
 */
process.on("uncaughtException", (error) => {
  logger.error("Erro não capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Promise rejeitada não tratada:", reason);
  process.exit(1);
});

// Inicia o servidor
startServer();
