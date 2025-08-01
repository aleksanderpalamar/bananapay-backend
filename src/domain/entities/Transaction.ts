/**
 * Entidade que representa uma transação PIX no sistema
 */
export class Transaction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly pixKey: string,
    public readonly pixKeyType: PixKeyType,
    public readonly status: TransactionStatus,
    public readonly transactionType: TransactionType,
    public readonly scheduledDate: Date | undefined,
    public readonly executedAt: Date | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Cria uma nova instância de Transaction
   */
  static create(
    userId: string,
    amount: number,
    description: string,
    pixKey: string,
    pixKeyType: PixKeyType,
    transactionType: TransactionType,
    scheduledDate?: Date
  ): {
    userId: string;
    amount: number;
    description: string;
    pixKey: string;
    pixKeyType: PixKeyType;
    transactionType: TransactionType;
    scheduledDate?: Date;
  } {
    return {
      userId,
      amount,
      description,
      pixKey,
      pixKeyType,
      transactionType,
      scheduledDate,
    };
  }

  /**
   * Marca a transação como executada
   */
  markAsExecuted(): Transaction {
    return new Transaction(
      this.id,
      this.userId,
      this.amount,
      this.description,
      this.pixKey,
      this.pixKeyType,
      TransactionStatus.EXECUTED,
      this.transactionType,
      this.scheduledDate,
      new Date(),
      this.createdAt,
      new Date()
    );
  }

  /**
   * Marca a transação como falhada
   */
  markAsFailed(): Transaction {
    return new Transaction(
      this.id,
      this.userId,
      this.amount,
      this.description,
      this.pixKey,
      this.pixKeyType,
      TransactionStatus.FAILED,
      this.transactionType,
      this.scheduledDate,
      this.executedAt,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Marca a transação como cancelada
   */
  markAsCancelled(): Transaction {
    return new Transaction(
      this.id,
      this.userId,
      this.amount,
      this.description,
      this.pixKey,
      this.pixKeyType,
      TransactionStatus.CANCELLED,
      this.transactionType,
      this.scheduledDate,
      this.executedAt,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Verifica se a transação pode ser executada
   */
  canBeExecuted(): boolean {
    return (
      this.status === TransactionStatus.PENDING &&
      (!this.scheduledDate || this.scheduledDate <= new Date())
    );
  }

  /**
   * Verifica se a transação pode ser cancelada
   */
  canBeCancelled(): boolean {
    return (
      this.status === TransactionStatus.PENDING ||
      this.status === TransactionStatus.SCHEDULED
    );
  }

  /**
   * Verifica se a transação é agendada
   */
  isScheduled(): boolean {
    return this.transactionType === TransactionType.SCHEDULED;
  }

  /**
   * Verifica se a transação é automática
   */
  isAutomatic(): boolean {
    return this.transactionType === TransactionType.AUTOMATIC;
  }
}

/**
 * Enum que define os status de uma transação
 */
export enum TransactionStatus {
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  SCHEDULED = "SCHEDULED",
}

/**
 * Enum que define os tipos de transação
 */
export enum TransactionType {
  IMMEDIATE = "IMMEDIATE",
  SCHEDULED = "SCHEDULED",
  AUTOMATIC = "AUTOMATIC",
}

/**
 * Enum que define os tipos de chave PIX (reutilizado de Contact.ts)
 */
export enum PixKeyType {
  CPF = "CPF",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  RANDOM = "RANDOM",
}
