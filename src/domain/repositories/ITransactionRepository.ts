import {
  Transaction,
  TransactionStatus,
  TransactionType,
  PixKeyType,
} from "../entities/Transaction";

/**
 * Interface que define os contratos do repositório de transações
 */
export interface ITransactionRepository {
  /**
   * Cria uma nova transação
   */
  create(transaction: {
    userId: string;
    amount: number;
    description: string;
    pixKey: string;
    pixKeyType: PixKeyType;
    transactionType: TransactionType;
    scheduledDate?: Date;
  }): Promise<Transaction>;

  /**
   * Busca uma transação pelo ID
   */
  findById(id: string): Promise<Transaction | null>;

  /**
   * Busca transações por usuário
   */
  findByUserId(userId: string): Promise<Transaction[]>;

  /**
   * Busca transações por status
   */
  findByStatus(status: TransactionStatus): Promise<Transaction[]>;

  /**
   * Busca transações por tipo
   */
  findByType(type: TransactionType): Promise<Transaction[]>;

  /**
   * Busca transações agendadas para execução
   */
  findScheduledForExecution(): Promise<Transaction[]>;

  /**
   * Busca transações automáticas para execução
   */
  findAutomaticForExecution(): Promise<Transaction[]>;

  /**
   * Lista todas as transações
   */
  findAll(): Promise<Transaction[]>;

  /**
   * Atualiza uma transação existente
   */
  update(
    id: string,
    transaction: Partial<{
      amount: number;
      description: string;
      pixKey: string;
      pixKeyType: PixKeyType;
      status: TransactionStatus;
      transactionType: TransactionType;
      scheduledDate?: Date;
      executedAt?: Date;
    }>
  ): Promise<Transaction>;

  /**
   * Remove uma transação
   */
  delete(id: string): Promise<void>;

  /**
   * Marca uma transação como executada
   */
  markAsExecuted(id: string): Promise<Transaction>;

  /**
   * Marca uma transação como falhada
   */
  markAsFailed(id: string): Promise<Transaction>;

  /**
   * Marca uma transação como cancelada
   */
  markAsCancelled(id: string): Promise<Transaction>;
}
