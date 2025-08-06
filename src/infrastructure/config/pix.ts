import dotenv from "dotenv";

dotenv.config();

/**
 * Configurações da API Pix do Banco do Brasil
 */
export const pixConfig = {
  baseUrl: process.env.BB_API_BASE_URL || "https://api.bb.com.br/pix/v1",
  clientId: process.env.BB_CLIENT_ID || "",
  clientSecret: process.env.BB_CLIENT_SECRET || "",
  developerApplicationKey: process.env.BB_DEVELOPER_APPLICATION_KEY || "",
  pixKey: process.env.BB_PIX_KEY || "",
};

/**
 * Valida se todas as configurações necessárias estão presentes
 */
export function validatePixConfig(): void {
  const requiredEnvVars = [
    "BB_CLIENT_ID",
    "BB_CLIENT_SECRET",
    "BB_DEVELOPER_APPLICATION_KEY",
    "BB_PIX_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não configuradas: ${missingVars.join(
        ", "
      )}`
    );
  }
}
