import { PrismaClient } from "@prisma/client";
import { Contact, PixKey, PixKeyType } from "../../domain/entities/Contact";
import { IContactRepository } from "../../domain/repositories/IContactRepository";

/**
 * Implementação do repositório de contatos usando Prisma
 */
export class PrismaContactRepository implements IContactRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Cria um novo contato
   */
  async create(contact: {
    userId: string;
    name: string;
    pixKeys: PixKey[];
  }): Promise<Contact> {
    const createdContact = await this.prisma.contact.create({
      data: {
        userId: contact.userId,
        name: contact.name,
        pixKeys: {
          create: contact.pixKeys.map((pixKey) => ({
            key: pixKey.key,
            keyType: pixKey.keyType,
            isActive: pixKey.isActive,
          })),
        },
      },
      include: {
        pixKeys: true,
      },
    });

    return new Contact(
      createdContact.id,
      createdContact.userId,
      createdContact.name,
      createdContact.pixKeys.map(
        (pixKey) =>
          new PixKey(
            pixKey.id,
            pixKey.key,
            pixKey.keyType as PixKeyType,
            pixKey.isActive
          )
      ),
      createdContact.createdAt,
      createdContact.updatedAt
    );
  }

  /**
   * Busca um contato pelo ID
   */
  async findById(id: string): Promise<Contact | null> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        pixKeys: true,
      },
    });

    if (!contact) return null;

    return new Contact(
      contact.id,
      contact.userId,
      contact.name,
      contact.pixKeys.map(
        (pixKey) =>
          new PixKey(
            pixKey.id,
            pixKey.key,
            pixKey.keyType as PixKeyType,
            pixKey.isActive
          )
      ),
      contact.createdAt,
      contact.updatedAt
    );
  }

  /**
   * Busca contatos por usuário
   */
  async findByUserId(userId: string): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
      include: {
        pixKeys: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(
      (contact) =>
        new Contact(
          contact.id,
          contact.userId,
          contact.name,
          contact.pixKeys.map(
            (pixKey) =>
              new PixKey(
                pixKey.id,
                pixKey.key,
                pixKey.keyType as PixKeyType,
                pixKey.isActive
              )
          ),
          contact.createdAt,
          contact.updatedAt
        )
    );
  }

  /**
   * Busca um contato por nome e usuário
   */
  async findByNameAndUserId(
    name: string,
    userId: string
  ): Promise<Contact | null> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        name,
        userId,
      },
      include: {
        pixKeys: true,
      },
    });

    if (!contact) return null;

    return new Contact(
      contact.id,
      contact.userId,
      contact.name,
      contact.pixKeys.map(
        (pixKey) =>
          new PixKey(
            pixKey.id,
            pixKey.key,
            pixKey.keyType as PixKeyType,
            pixKey.isActive
          )
      ),
      contact.createdAt,
      contact.updatedAt
    );
  }

  /**
   * Lista todos os contatos
   */
  async findAll(): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany({
      include: {
        pixKeys: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return contacts.map(
      (contact) =>
        new Contact(
          contact.id,
          contact.userId,
          contact.name,
          contact.pixKeys.map(
            (pixKey) =>
              new PixKey(
                pixKey.id,
                pixKey.key,
                pixKey.keyType as PixKeyType,
                pixKey.isActive
              )
          ),
          contact.createdAt,
          contact.updatedAt
        )
    );
  }

  /**
   * Atualiza um contato existente
   */
  async update(
    id: string,
    contact: Partial<{
      name: string;
      pixKeys: PixKey[];
    }>
  ): Promise<Contact> {
    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: {
        name: contact.name,
        ...(contact.pixKeys && {
          pixKeys: {
            deleteMany: {},
            create: contact.pixKeys.map((pixKey) => ({
              key: pixKey.key,
              keyType: pixKey.keyType,
              isActive: pixKey.isActive,
            })),
          },
        }),
      },
      include: {
        pixKeys: true,
      },
    });

    return new Contact(
      updatedContact.id,
      updatedContact.userId,
      updatedContact.name,
      updatedContact.pixKeys.map(
        (pixKey) =>
          new PixKey(
            pixKey.id,
            pixKey.key,
            pixKey.keyType as PixKeyType,
            pixKey.isActive
          )
      ),
      updatedContact.createdAt,
      updatedContact.updatedAt
    );
  }

  /**
   * Remove um contato
   */
  async delete(id: string): Promise<void> {
    await this.prisma.contact.delete({
      where: { id },
    });
  }

  /**
   * Verifica se um contato existe para o usuário
   */
  async existsByNameAndUserId(
    name: string,
    userId: string,
    excludeId?: string
  ): Promise<boolean> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        name,
        userId,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return !!contact;
  }
}
