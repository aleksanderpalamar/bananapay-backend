import {
  Transaction,
  TransactionType,
  PixKeyType,
} from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

/**
 * DTO para criação de transação
 */
export interface CreateTransactionRequest {
  userId: string;
  amount: number;
  description: string;
  pixKey: string;
  pixKeyType: PixKeyType;
  transactionType: TransactionType;
  scheduledDate?: Date;
}

/**
 * DTO para resposta de criação de transação
 */
export interface CreateTransactionResponse {
  id: string;
  userId: string;
  amount: number;
  description: string;
  pixKey: string;
  pixKeyType: PixKeyType;
  status: string;
  transactionType: TransactionType;
  scheduledDate?: Date;
  executedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Caso de uso para criação de transações
 */
export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: ITransactionRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Executa o caso de uso de criação de transação
   */
  async execute(
    request: CreateTransactionRequest
  ): Promise<CreateTransactionResponse> {
    // Validações de entrada
    this.validateRequest(request);

    // Verifica se o usuário existe
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Valida a chave PIX
    this.validatePixKey(request.pixKey, request.pixKeyType);

    // Valida o tipo de transação
    this.validateTransactionType(
      request.transactionType,
      request.scheduledDate
    );

    // Cria a transação
    const transactionData = Transaction.create(
      request.userId,
      request.amount,
      request.description,
      request.pixKey,
      request.pixKeyType,
      request.transactionType,
      request.scheduledDate
    );

    const transaction = await this.transactionRepository.create(
      transactionData
    );

    // Retorna a resposta
    return {
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      description: transaction.description,
      pixKey: transaction.pixKey,
      pixKeyType: transaction.pixKeyType,
      status: transaction.status,
      transactionType: transaction.transactionType,
      scheduledDate: transaction.scheduledDate,
      executedAt: transaction.executedAt,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  /**
   * Valida os dados de entrada
   */
  private validateRequest(request: CreateTransactionRequest): void {
    if (!request.userId) {
      throw new Error("ID do usuário é obrigatório");
    }

    if (!request.amount || request.amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    if (!request.description || request.description.trim().length < 3) {
      throw new Error("Descrição deve ter pelo menos 3 caracteres");
    }

    if (!request.pixKey) {
      throw new Error("Chave PIX é obrigatória");
    }

    if (!request.pixKeyType) {
      throw new Error("Tipo de chave PIX é obrigatório");
    }

    if (!request.transactionType) {
      throw new Error("Tipo de transação é obrigatório");
    }
  }

  /**
   * Valida a chave PIX
   */
  private validatePixKey(key: string, keyType: PixKeyType): void {
    switch (keyType) {
      case PixKeyType.CPF:
        if (!this.isValidCpf(key)) {
          throw new Error("CPF inválido");
        }
        break;
      case PixKeyType.EMAIL:
        if (!this.isValidEmail(key)) {
          throw new Error("Email inválido");
        }
        break;
      case PixKeyType.PHONE:
        if (!this.isValidPhone(key)) {
          throw new Error("Telefone inválido");
        }
        break;
      case PixKeyType.RANDOM:
        if (!this.isValidRandomKey(key)) {
          throw new Error("Chave aleatória inválida");
        }
        break;
      default:
        throw new Error("Tipo de chave PIX inválido");
    }
  }

  /**
   * Valida o tipo de transação
   */
  private validateTransactionType(
    transactionType: TransactionType,
    scheduledDate?: Date
  ): void {
    switch (transactionType) {
      case TransactionType.IMMEDIATE:
        if (scheduledDate) {
          throw new Error("Transação imediata não pode ter data agendada");
        }
        break;
      case TransactionType.SCHEDULED:
        if (!scheduledDate) {
          throw new Error("Transação agendada deve ter data de agendamento");
        }
        if (scheduledDate <= new Date()) {
          throw new Error("Data de agendamento deve ser futura");
        }
        break;
      case TransactionType.AUTOMATIC:
        if (!scheduledDate) {
          throw new Error("Transação automática deve ter data de agendamento");
        }
        break;
      default:
        throw new Error("Tipo de transação inválido");
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
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

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

    return (
      parseInt(cleanCpf.charAt(9)) === digit1 &&
      parseInt(cleanCpf.charAt(10)) === digit2
    );
  }

  /**
   * Valida formato de telefone
   */
  private isValidPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  /**
   * Valida formato de chave aleatória
   */
  private isValidRandomKey(key: string): boolean {
    return key.length >= 32 && key.length <= 77;
  }
}
