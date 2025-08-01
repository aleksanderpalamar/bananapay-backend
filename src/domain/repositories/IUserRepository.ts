import { User } from "../entities/User";

/**
 * Interface que define os contratos do repositório de usuários
 */
export interface IUserRepository {
  /**
   * Cria um novo usuário
   */
  create(user: { name: string; email: string; cpf: string }): Promise<User>;

  /**
   * Busca um usuário pelo ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário pelo email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca um usuário pelo CPF
   */
  findByCpf(cpf: string): Promise<User | null>;

  /**
   * Lista todos os usuários
   */
  findAll(): Promise<User[]>;

  /**
   * Atualiza um usuário existente
   */
  update(
    id: string,
    user: Partial<{
      name: string;
      email: string;
      cpf: string;
    }>
  ): Promise<User>;

  /**
   * Remove um usuário
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um email já está em uso
   */
  emailExists(email: string, excludeId?: string): Promise<boolean>;

  /**
   * Verifica se um CPF já está em uso
   */
  cpfExists(cpf: string, excludeId?: string): Promise<boolean>;
}
