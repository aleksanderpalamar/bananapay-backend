import { Request, Response } from "express";
import {
  CreateUserUseCase,
  CreateUserRequest,
} from "../../application/use-cases/CreateUserUseCase";
import { z } from "zod";

/**
 * Schema de validação para criação de usuário
 */
const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF deve ter pelo menos 11 dígitos"),
});

/**
 * Controller responsável por gerenciar as requisições de usuários
 */
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  /**
   * Cria um novo usuário
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Valida os dados de entrada
      const validatedData = createUserSchema.parse(req.body);

      // Executa o caso de uso
      const result = await this.createUserUseCase.execute(validatedData);

      // Retorna a resposta
      res.status(201).json({
        success: true,
        data: result,
        message: "Usuário criado com sucesso",
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
   * Busca um usuário pelo ID
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de busca de usuário
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
   * Lista todos os usuários
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implementar caso de uso de listagem de usuários
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
   * Atualiza um usuário
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de atualização de usuário
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
   * Remove um usuário
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Implementar caso de uso de remoção de usuário
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
