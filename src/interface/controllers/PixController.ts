import { Request, Response } from "express";
import {
  CreatePixChargeUseCase,
  CreatePixChargeRequest,
} from "../../application/use-cases/CreatePixChargeUseCase";
import { IPixService } from "../../domain/repositories/IPixService";
import { z } from "zod";

/**
 * Schema de validação para criação de cobrança Pix
 */
const createPixChargeSchema = z.object({
  value: z
    .number()
    .positive("Valor deve ser maior que zero")
    .max(1000000, "Valor máximo permitido é R$ 1.000.000,00"),
  payerName: z
    .string()
    .min(2, "Nome do pagador deve ter pelo menos 2 caracteres")
    .max(100, "Nome do pagador deve ter no máximo 100 caracteres"),
  payerCpf: z
    .string()
    .min(11, "CPF deve ter pelo menos 11 dígitos")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido"),
  payerEmail: z.string().email("Email inválido"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  expirationMinutes: z
    .number()
    .min(1, "Tempo de expiração deve ser pelo menos 1 minuto")
    .max(43200, "Tempo de expiração máximo é 30 dias (43200 minutos)")
    .optional(),
});

/**
 * Schema de validação para consulta de cobrança por txid
 */
const getChargeByTxidSchema = z.object({
  txid: z.string().min(1, "TXID é obrigatório"),
});

/**
 * Controller responsável por gerenciar as requisições de cobranças Pix
 */
export class PixController {
  constructor(
    private createPixChargeUseCase: CreatePixChargeUseCase,
    private pixService: IPixService
  ) {}

  /**
   * Cria uma nova cobrança Pix
   */
  async createCharge(req: Request, res: Response): Promise<void> {
    try {
      // Valida os dados de entrada
      const validatedData = createPixChargeSchema.parse(req.body);

      // Executa o caso de uso
      const result = await this.createPixChargeUseCase.execute(validatedData);

      // Retorna a resposta
      res.status(201).json({
        success: true,
        data: result,
        message: "Cobrança Pix criada com sucesso",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
        return;
      }

      if (error instanceof Error) {
        // Tratamento específico para erros de negócio
        if (error.message.includes("autenticação")) {
          res.status(401).json({
            success: false,
            error: "Erro de autenticação com a API Pix",
            details: error.message,
          });
          return;
        }

        if (error.message.includes("API")) {
          res.status(502).json({
            success: false,
            error: "Erro na integração com a API Pix",
            details: error.message,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Consulta uma cobrança Pix pelo txid
   */
  async getChargeByTxid(req: Request, res: Response): Promise<void> {
    try {
      // Valida os dados de entrada
      const { txid } = getChargeByTxidSchema.parse(req.params);

      // Consulta a cobrança através do serviço
      const charge = await this.pixService.getChargeByTxid(txid);

      if (!charge) {
        res.status(404).json({
          success: false,
          error: "Cobrança Pix não encontrada",
        });
        return;
      }

      // Retorna a resposta
      res.status(200).json({
        success: true,
        data: {
          id: charge.id,
          txid: charge.txid,
          locationUrl: charge.locationUrl,
          status: charge.status,
          value: charge.value,
          payerName: charge.payerName,
          payerCpf: charge.payerCpf,
          payerEmail: charge.payerEmail,
          description: charge.description,
          expiresAt: charge.expiresAt,
          createdAt: charge.createdAt,
          updatedAt: charge.updatedAt,
        },
        message: "Cobrança Pix encontrada com sucesso",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
        return;
      }

      if (error instanceof Error) {
        // Tratamento específico para erros de integração
        if (error.message.includes("autenticação")) {
          res.status(401).json({
            success: false,
            error: "Erro de autenticação com a API Pix",
            details: error.message,
          });
          return;
        }

        if (error.message.includes("API")) {
          res.status(502).json({
            success: false,
            error: "Erro na integração com a API Pix",
            details: error.message,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Cancela uma cobrança Pix
   */
  async cancelCharge(req: Request, res: Response): Promise<void> {
    try {
      // Valida os dados de entrada
      const { txid } = getChargeByTxidSchema.parse(req.params);

      // Cancela a cobrança através do serviço
      await this.pixService.cancelCharge(txid);

      // Retorna a resposta
      res.status(200).json({
        success: true,
        data: { txid },
        message: "Cobrança Pix cancelada com sucesso",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
        return;
      }

      if (error instanceof Error) {
        // Tratamento específico para erros de integração
        if (error.message.includes("autenticação")) {
          res.status(401).json({
            success: false,
            error: "Erro de autenticação com a API Pix",
            details: error.message,
          });
          return;
        }

        if (error.message.includes("API")) {
          res.status(502).json({
            success: false,
            error: "Erro na integração com a API Pix",
            details: error.message,
          });
          return;
        }

        // Tratamento para cobrança não encontrada
        if (error.message.includes("não encontrada")) {
          res.status(404).json({
            success: false,
            error: "Cobrança Pix não encontrada",
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Lista cobranças Pix por status
   */
  async getChargesByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;

      if (!status || typeof status !== "string") {
        res.status(400).json({
          success: false,
          error: "Status é obrigatório",
        });
        return;
      }

      // Valida se o status é válido
      const validStatuses = [
        "ATIVA",
        "CONCLUIDA",
        "REMOVIDA_PELO_USUARIO_RECEBEDOR",
        "REMOVIDA_PELO_PSP",
        "EXPIRADA",
      ];

      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: "Status inválido",
          validStatuses,
        });
        return;
      }

      // Consulta as cobranças através do serviço
      const charges = await this.pixService.getChargesByStatus(
        status as any // Convertido para o enum
      );

      // Retorna a resposta
      res.status(200).json({
        success: true,
        data: charges.map((charge) => ({
          id: charge.id,
          txid: charge.txid,
          locationUrl: charge.locationUrl,
          status: charge.status,
          value: charge.value,
          payerName: charge.payerName,
          payerCpf: charge.payerCpf,
          payerEmail: charge.payerEmail,
          description: charge.description,
          expiresAt: charge.expiresAt,
          createdAt: charge.createdAt,
          updatedAt: charge.updatedAt,
        })),
        message: `Cobranças Pix com status ${status} encontradas`,
        count: charges.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Tratamento específico para erros de integração
        if (error.message.includes("autenticação")) {
          res.status(401).json({
            success: false,
            error: "Erro de autenticação com a API Pix",
            details: error.message,
          });
          return;
        }

        if (error.message.includes("API")) {
          res.status(502).json({
            success: false,
            error: "Erro na integração com a API Pix",
            details: error.message,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
}
