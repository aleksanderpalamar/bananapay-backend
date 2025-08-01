import { Request, Response } from "express";
import {
  CreateTransactionUseCase,
  CreateTransactionRequest,
} from "../../application/use-cases/CreateTransactionUseCase";
import { TransactionType, PixKeyType } from "../../domain/entities/Transaction";
import { z } from "zod";

/**
 * Schema de validação para criação de transação
 */
const createTransactionSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  pixKey: z.string().min(1, "Chave PIX é obrigatória"),
  pixKeyType: z.nativeEnum(PixKeyType, {
    errorMap: () => ({ message: "Tipo de chave PIX inválido" }),
  }),
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "Tipo de transação inválido" }),
  }),
  scheduledDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

/**
 * Controller responsável por gerenciar as requisições de transações
 */
export class TransactionController {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

  /**
   * Cria uma nova transação
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Valida os dados de entrada
      const validatedData = createTransactionSchema.parse(req.body);

      // Executa o caso de uso
      const result = await this.createTransactionUseCase.execute(validatedData);

      // Retorna a resposta
      res.status(201).json({
        success: true,
        data: result,
        message: "Transação criada com sucesso",
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
   * Busca uma transação pelo ID
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de busca de transação
      res.status(501).json({
        success: false,
        error: "Funcionalidade não implementada",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Busca transações por usuário
   */
  async findByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // TODO: Implementar caso de uso de busca de transações por usuário
      res.status(501).json({
        success: false,
        error: "Funcionalidade não implementada",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Lista todas as transações
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implementar caso de uso de listagem de transações
      res.status(501).json({
        success: false,
        error: "Funcionalidade não implementada",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Cancela uma transação
   */
  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de cancelamento de transação
      res.status(501).json({
        success: false,
        error: "Funcionalidade não implementada",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Executa uma transação agendada
   */
  async execute(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de execução de transação
      res.status(501).json({
        success: false,
        error: "Funcionalidade não implementada",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }
}
