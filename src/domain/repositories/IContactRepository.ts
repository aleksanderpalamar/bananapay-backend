import { Contact, PixKey } from "../entities/Contact";

/**
 * Interface que define os contratos do repositório de contatos
 */
export interface IContactRepository {
  /**
   * Cria um novo contato
   */
  create(contact: {
    userId: string;
    name: string;
    pixKeys: PixKey[];
  }): Promise<Contact>;

  /**
   * Busca um contato pelo ID
   */
  findById(id: string): Promise<Contact | null>;

  /**
   * Busca contatos por usuário
   */
  findByUserId(userId: string): Promise<Contact[]>;

  /**
   * Busca um contato por nome e usuário
   */
  findByNameAndUserId(name: string, userId: string): Promise<Contact | null>;

  /**
   * Lista todos os contatos
   */
  findAll(): Promise<Contact[]>;

  /**
   * Atualiza um contato existente
   */
  update(
    id: string,
    contact: Partial<{
      name: string;
      pixKeys: PixKey[];
    }>
  ): Promise<Contact>;

  /**
   * Remove um contato
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um contato existe para o usuário
   */
  existsByNameAndUserId(
    name: string,
    userId: string,
    excludeId?: string
  ): Promise<boolean>;
}
