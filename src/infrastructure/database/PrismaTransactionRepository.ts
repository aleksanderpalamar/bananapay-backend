import { PrismaClient } from "@prisma/client";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
  PixKeyType,
} from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

/**
 * Implementação do repositório de transações usando Prisma
 */
export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria uma nova transação
   */
  async create(transaction: {
    userId: string;
    amount: number;
    description: string;
    pixKey: string;
    pixKeyType: PixKeyType;
    transactionType: TransactionType;
    scheduledDate?: Date;
  }): Promise<Transaction> {
    const createdTransaction = await this.prisma.transaction.create({
      data: {
        userId: transaction.userId,
        amount: transaction.amount,
        description: transaction.description,
        pixKey: transaction.pixKey,
        pixKeyType: transaction.pixKeyType,
        status: TransactionStatus.PENDING,
        transactionType: transaction.transactionType,
        scheduledDate: transaction.scheduledDate,
      },
    });

    return new Transaction(
      createdTransaction.id,
      createdTransaction.userId,
      createdTransaction.amount,
      createdTransaction.description,
      createdTransaction.pixKey,
      createdTransaction.pixKeyType as PixKeyType,
      createdTransaction.status as TransactionStatus,
      createdTransaction.transactionType as TransactionType,
      createdTransaction.scheduledDate || undefined,
      createdTransaction.executedAt || undefined,
      createdTransaction.createdAt,
      createdTransaction.updatedAt
    );
  }

  /**
   * Busca uma transação pelo ID
   */
  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) return null;

    return new Transaction(
      transaction.id,
      transaction.userId,
      transaction.amount,
      transaction.description,
      transaction.pixKey,
      transaction.pixKeyType as PixKeyType,
      transaction.status as TransactionStatus,
      transaction.transactionType as TransactionType,
      transaction.scheduledDate || undefined,
      transaction.executedAt || undefined,
      transaction.createdAt,
      transaction.updatedAt
    );
  }

  /**
   * Busca transações por usuário
   */
  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.description,
          transaction.pixKey,
          transaction.pixKeyType as PixKeyType,
          transaction.status as TransactionStatus,
          transaction.transactionType as TransactionType,
          transaction.scheduledDate || undefined,
          transaction.executedAt || undefined,
          transaction.createdAt,
          transaction.updatedAt
        )
    );
  }

  /**
   * Busca transações por status
   */
  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.description,
          transaction.pixKey,
          transaction.pixKeyType as PixKeyType,
          transaction.status as TransactionStatus,
          transaction.transactionType as TransactionType,
          transaction.scheduledDate || undefined,
          transaction.executedAt || undefined,
          transaction.createdAt,
          transaction.updatedAt
        )
    );
  }

  /**
   * Busca transações por tipo
   */
  async findByType(type: TransactionType): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { transactionType: type },
      orderBy: { createdAt: "desc" },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.description,
          transaction.pixKey,
          transaction.pixKeyType as PixKeyType,
          transaction.status as TransactionStatus,
          transaction.transactionType as TransactionType,
          transaction.scheduledDate || undefined,
          transaction.executedAt || undefined,
          transaction.createdAt,
          transaction.updatedAt
        )
    );
  }

  /**
   * Busca transações agendadas para execução
   */
  async findScheduledForExecution(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        transactionType: TransactionType.SCHEDULED,
        status: TransactionStatus.PENDING,
        scheduledDate: {
          lte: new Date(),
        },
      },
      orderBy: { scheduledDate: "asc" },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.description,
          transaction.pixKey,
          transaction.pixKeyType as PixKeyType,
          transaction.status as TransactionStatus,
          transaction.transactionType as TransactionType,
          transaction.scheduledDate || undefined,
          transaction.executedAt || undefined,
          transaction.createdAt,
          transaction.updatedAt
        )
    );
  }

  /**
   * Busca transações automáticas para execução
   */
  async findAutomaticForExecution(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        transactionType: TransactionType.AUTOMATIC,
        status: TransactionStatus.PENDING,
        scheduledDate: {
          lte: new Date(),
        },
      },
      orderBy: { scheduledDate: "asc" },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.description,
          transaction.pixKey,
          transaction.pixKeyType as PixKeyType,
          transaction.status as TransactionStatus,
          transaction.transactionType as TransactionType,
          transaction.scheduledDate || undefined,
          transaction.executedAt || undefined,
          transaction.createdAt,
          transaction.updatedAt
        )
    );
  }

  /**
   * Lista todas as transações
   */
  async findAll(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    return transactions.map(
      (transaction) =>
        new Transaction(
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.description,
          transaction.pixKey,
          transaction.pixKeyType as PixKeyType,
          transaction.status as TransactionStatus,
          transaction.transactionType as TransactionType,
          transaction.scheduledDate || undefined,
          transaction.executedAt || undefined,
          transaction.createdAt,
          transaction.updatedAt
        )
    );
  }

  /**
   * Atualiza uma transação existente
   */
  async update(
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
  ): Promise<Transaction> {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        amount: transaction.amount,
        description: transaction.description,
        pixKey: transaction.pixKey,
        pixKeyType: transaction.pixKeyType,
        status: transaction.status,
        transactionType: transaction.transactionType,
        scheduledDate: transaction.scheduledDate,
        executedAt: transaction.executedAt,
      },
    });

    return new Transaction(
      updatedTransaction.id,
      updatedTransaction.userId,
      updatedTransaction.amount,
      updatedTransaction.description,
      updatedTransaction.pixKey,
      updatedTransaction.pixKeyType as PixKeyType,
      updatedTransaction.status as TransactionStatus,
      updatedTransaction.transactionType as TransactionType,
      updatedTransaction.scheduledDate || undefined,
      updatedTransaction.executedAt || undefined,
      updatedTransaction.createdAt,
      updatedTransaction.updatedAt
    );
  }

  /**
   * Remove uma transação
   */
  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  /**
   * Marca uma transação como executada
   */
  async markAsExecuted(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.EXECUTED,
        executedAt: new Date(),
      },
    });

    return new Transaction(
      transaction.id,
      transaction.userId,
      transaction.amount,
      transaction.description,
      transaction.pixKey,
      transaction.pixKeyType as PixKeyType,
      transaction.status as TransactionStatus,
      transaction.transactionType as TransactionType,
      transaction.scheduledDate || undefined,
      transaction.executedAt || undefined,
      transaction.createdAt,
      transaction.updatedAt
    );
  }

  /**
   * Marca uma transação como falhada
   */
  async markAsFailed(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.FAILED,
      },
    });

    return new Transaction(
      transaction.id,
      transaction.userId,
      transaction.amount,
      transaction.description,
      transaction.pixKey,
      transaction.pixKeyType as PixKeyType,
      transaction.status as TransactionStatus,
      transaction.transactionType as TransactionType,
      transaction.scheduledDate || undefined,
      transaction.executedAt || undefined,
      transaction.createdAt,
      transaction.updatedAt
    );
  }

  /**
   * Marca uma transação como cancelada
   */
  async markAsCancelled(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.CANCELLED,
      },
    });

    return new Transaction(
      transaction.id,
      transaction.userId,
      transaction.amount,
      transaction.description,
      transaction.pixKey,
      transaction.pixKeyType as PixKeyType,
      transaction.status as TransactionStatus,
      transaction.transactionType as TransactionType,
      transaction.scheduledDate || undefined,
      transaction.executedAt || undefined,
      transaction.createdAt,
      transaction.updatedAt
    );
  }
}
