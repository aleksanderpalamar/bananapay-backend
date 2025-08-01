import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

/**
 * Implementação do repositório de usuários usando Prisma
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo usuário
   */
  async create(user: {
    name: string;
    email: string;
    cpf: string;
  }): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        cpf: user.cpf,
      },
    });

    return new User(
      createdUser.id,
      createdUser.name,
      createdUser.email,
      createdUser.cpf,
      createdUser.createdAt,
      createdUser.updatedAt
    );
  }

  /**
   * Busca um usuário pelo ID
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.cpf,
      user.createdAt,
      user.updatedAt
    );
  }

  /**
   * Busca um usuário pelo email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.cpf,
      user.createdAt,
      user.updatedAt
    );
  }

  /**
   * Busca um usuário pelo CPF
   */
  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.name,
      user.email,
      user.cpf,
      user.createdAt,
      user.updatedAt
    );
  }

  /**
   * Lista todos os usuários
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return users.map(
      (user) =>
        new User(
          user.id,
          user.name,
          user.email,
          user.cpf,
          user.createdAt,
          user.updatedAt
        )
    );
  }

  /**
   * Atualiza um usuário existente
   */
  async update(
    id: string,
    user: Partial<{
      name: string;
      email: string;
      cpf: string;
    }>
  ): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        email: user.email,
        cpf: user.cpf,
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.cpf,
      updatedUser.createdAt,
      updatedUser.updatedAt
    );
  }

  /**
   * Remove um usuário
   */
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Verifica se um email já está em uso
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return !!user;
  }

  /**
   * Verifica se um CPF já está em uso
   */
  async cpfExists(cpf: string, excludeId?: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        cpf,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return !!user;
  }
}
