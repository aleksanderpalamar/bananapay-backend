import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * DTO para criação de usuário
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  cpf: string;
}

/**
 * DTO para resposta de criação de usuário
 */
export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Caso de uso para criação de usuários
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Executa o caso de uso de criação de usuário
   */
  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    // Validações de entrada
    this.validateRequest(request);

    // Verifica se o email já está em uso
    const existingUserByEmail = await this.userRepository.findByEmail(request.email);
    if (existingUserByEmail) {
      throw new Error('Email já está em uso');
    }

    // Verifica se o CPF já está em uso
    const existingUserByCpf = await this.userRepository.findByCpf(request.cpf);
    if (existingUserByCpf) {
      throw new Error('CPF já está em uso');
    }

    // Cria o usuário
    const userData = User.create(request.name, request.email, request.cpf);
    const user = await this.userRepository.create(userData);

    // Retorna a resposta
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Valida os dados de entrada
   */
  private validateRequest(request: CreateUserRequest): void {
    if (!request.name || request.name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!request.email || !this.isValidEmail(request.email)) {
      throw new Error('Email inválido');
    }

    if (!request.cpf || !this.isValidCpf(request.cpf)) {
      throw new Error('CPF inválido');
    }
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida formato de CPF
   */
  private isValidCpf(cpf: string): boolean {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cleanCpf.charAt(9)) === digit1 && parseInt(cleanCpf.charAt(10)) === digit2;
  }
} 