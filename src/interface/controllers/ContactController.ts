import { Request, Response } from "express";
import {
  CreateContactUseCase,
  CreateContactRequest,
  PixKeyRequest,
} from "../../application/use-cases/CreateContactUseCase";
import { PixKeyType } from "../../domain/entities/Contact";
import { z } from "zod";

/**
 * Schema de validação para chave PIX
 */
const pixKeySchema = z.object({
  key: z.string().min(1, "Chave PIX é obrigatória"),
  keyType: z.nativeEnum(PixKeyType, {
    errorMap: () => ({ message: "Tipo de chave PIX inválido" }),
  }),
});

/**
 * Schema de validação para criação de contato
 */
const createContactSchema = z.object({
  userId: z.string().min(1, "ID do usuário é obrigatório"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  pixKeys: z
    .array(pixKeySchema)
    .min(1, "Pelo menos uma chave PIX é obrigatória")
    .max(5, "Máximo de 5 chaves PIX por contato"),
});

/**
 * Controller responsável por gerenciar as requisições de contatos
 */
export class ContactController {
  constructor(private createContactUseCase: CreateContactUseCase) {}

  /**
   * Cria um novo contato
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Valida os dados de entrada
      const validatedData = createContactSchema.parse(req.body);

      // Executa o caso de uso
      const result = await this.createContactUseCase.execute(validatedData);

      // Retorna a resposta
      res.status(201).json({
        success: true,
        data: result,
        message: "Contato criado com sucesso",
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
   * Busca um contato pelo ID
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de busca de contato
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
   * Busca contatos por usuário
   */
  async findByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // TODO: Implementar caso de uso de busca de contatos por usuário
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
   * Lista todos os contatos
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implementar caso de uso de listagem de contatos
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
   * Atualiza um contato
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de atualização de contato
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
   * Remove um contato
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de remoção de contato
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
