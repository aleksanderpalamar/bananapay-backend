import axios, { AxiosInstance } from "axios";
import { PixCharge, PixChargeStatus } from "../../domain/entities/PixCharge";
import { IPixService } from "../../domain/repositories/IPixService";
import logger from "../config/logger";
import { pixConfig, validatePixConfig } from "../config/pix";

/**
 * Dados de configuração da API Pix do Banco do Brasil
 */
interface BancoDoBrasilConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  developerApplicationKey: string;
}

/**
 * Token de acesso OAuth2
 */
interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

/**
 * Payload para criação de cobrança Pix
 */
interface CreateChargePayload {
  calendario: {
    expiracao: number;
  };
  devedor: {
    nome: string;
    cpf: string;
  };
  valor: {
    original: string;
  };
  chave: string;
  solicitacaoPagador?: string;
}

/**
 * Resposta da API para criação de cobrança
 */
interface CreateChargeResponse {
  calendario: {
    criacao: string;
    expiracao: number;
  };
  txid: string;
  revisao: number;
  loc: {
    id: number;
    location: string;
    tipoCob: string;
    criacao: string;
  };
  status: string;
  devedor: {
    nome: string;
    cpf: string;
  };
  valor: {
    original: string;
  };
  chave: string;
  solicitacaoPagador?: string;
}

/**
 * Resposta da API para consulta de cobrança
 */
interface GetChargeResponse {
  calendario: {
    criacao: string;
    expiracao: number;
  };
  txid: string;
  revisao: number;
  loc: {
    id: number;
    location: string;
    tipoCob: string;
    criacao: string;
  };
  status: string;
  devedor: {
    nome: string;
    cpf: string;
  };
  valor: {
    original: string;
  };
  chave: string;
  solicitacaoPagador?: string;
  pix?: Array<{
    endToEndId: string;
    txid: string;
    valor: string;
    horario: string;
  }>;
}

/**
 * Implementação do serviço de integração com a API Pix do Banco do Brasil
 */
export class BancoDoBrasilPixService implements IPixService {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config?: BancoDoBrasilConfig) {
    // Valida configurações obrigatórias
    validatePixConfig();

    const serviceConfig = config || {
      baseUrl: pixConfig.baseUrl,
      clientId: pixConfig.clientId,
      clientSecret: pixConfig.clientSecret,
      developerApplicationKey: pixConfig.developerApplicationKey,
    };

    this.axiosInstance = axios.create({
      baseURL: serviceConfig.baseUrl,
      timeout: 30000,
    });

    // Interceptor para adicionar headers de autenticação
    this.axiosInstance.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      config.headers.Authorization = `Bearer ${this.accessToken}`;
      config.headers["Content-Type"] = "application/json";
      config.headers["developer-application-key"] =
        serviceConfig.developerApplicationKey;
      return config;
    });

    // Interceptor para logging de erros
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.info("API Pix request successful", {
          url: response.config.url,
          method: response.config.method,
          status: response.status,
        });
        return response;
      },
      (error) => {
        logger.error("API Pix request failed", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Garante que o token de acesso é válido
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
  }

  /**
   * Autentica com a API do Banco do Brasil usando OAuth2
   */
  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post(
        `${pixConfig.baseUrl}/oauth/token`,
        {
          grant_type: "client_credentials",
          client_id: pixConfig.clientId,
          client_secret: pixConfig.clientSecret,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const tokenData: AccessToken = response.data;
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000; // Expira 1 minuto antes

      logger.info("Successfully authenticated with Banco do Brasil API");
    } catch (error) {
      logger.error("Failed to authenticate with Banco do Brasil API", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error("Falha na autenticação com a API do Banco do Brasil");
    }
  }

  /**
   * Cria uma nova cobrança Pix
   */
  async createCharge(
    charge: Omit<
      PixCharge,
      "id" | "txid" | "locationUrl" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<PixCharge> {
    try {
      const payload: CreateChargePayload = {
        calendario: {
          expiracao: Math.floor(
            (charge.expiresAt.getTime() - Date.now()) / 1000
          ),
        },
        devedor: {
          nome: charge.payerName,
          cpf: charge.payerCpf.replace(/\D/g, ""),
        },
        valor: {
          original: charge.value.toFixed(2),
        },
        chave: pixConfig.pixKey,
        solicitacaoPagador: charge.description,
      };

      const response = await this.axiosInstance.post<CreateChargeResponse>(
        "/v2/cob",
        payload
      );

      const responseData = response.data;

      return new PixCharge(
        responseData.txid,
        responseData.txid,
        responseData.loc.location,
        this.mapStatus(responseData.status),
        parseFloat(responseData.valor.original),
        responseData.devedor.nome,
        responseData.devedor.cpf,
        charge.payerEmail, // Email não retornado pela API
        charge.description,
        new Date(Date.now() + responseData.calendario.expiracao * 1000),
        new Date(responseData.calendario.criacao),
        new Date()
      );
    } catch (error) {
      logger.error("Failed to create Pix charge", {
        charge,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error("Falha ao criar cobrança Pix");
    }
  }

  /**
   * Consulta uma cobrança Pix pelo txid
   */
  async getChargeByTxid(txid: string): Promise<PixCharge | null> {
    try {
      const response = await this.axiosInstance.get<GetChargeResponse>(
        `/v2/cob/${txid}`
      );

      const responseData = response.data;

      return new PixCharge(
        responseData.txid,
        responseData.txid,
        responseData.loc.location,
        this.mapStatus(responseData.status),
        parseFloat(responseData.valor.original),
        responseData.devedor.nome,
        responseData.devedor.cpf,
        "", // Email não disponível na consulta
        responseData.solicitacaoPagador || "",
        new Date(Date.now() + responseData.calendario.expiracao * 1000),
        new Date(responseData.calendario.criacao),
        new Date()
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      logger.error("Failed to get Pix charge by txid", {
        txid,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error("Falha ao consultar cobrança Pix");
    }
  }

  /**
   * Consulta cobranças Pix por status
   */
  async getChargesByStatus(status: PixChargeStatus): Promise<PixCharge[]> {
    try {
      // A API do Banco do Brasil não possui endpoint para listar por status
      // Esta implementação seria customizada conforme necessidade
      logger.warn("getChargesByStatus not implemented - API limitation");
      return [];
    } catch (error) {
      logger.error("Failed to get Pix charges by status", {
        status,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error("Falha ao consultar cobranças Pix por status");
    }
  }

  /**
   * Cancela uma cobrança Pix
   */
  async cancelCharge(txid: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/v2/cob/${txid}`);
      logger.info("Successfully cancelled Pix charge", { txid });
    } catch (error) {
      logger.error("Failed to cancel Pix charge", {
        txid,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new Error("Falha ao cancelar cobrança Pix");
    }
  }

  /**
   * Mapeia o status da API para o enum do domínio
   */
  private mapStatus(apiStatus: string): PixChargeStatus {
    switch (apiStatus) {
      case "ATIVA":
        return PixChargeStatus.ATIVA;
      case "CONCLUIDA":
        return PixChargeStatus.CONCLUIDA;
      case "REMOVIDA_PELO_USUARIO_RECEBEDOR":
        return PixChargeStatus.REMOVIDA_PELO_USUARIO_RECEBEDOR;
      case "REMOVIDA_PELO_PSP":
        return PixChargeStatus.REMOVIDA_PELO_PSP;
      case "EXPIRADA":
        return PixChargeStatus.EXPIRADA;
      default:
        return PixChargeStatus.ATIVA;
    }
  }
}
