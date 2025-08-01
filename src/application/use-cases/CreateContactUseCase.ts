import { Contact, PixKey, PixKeyType } from '../../domain/entities/Contact';
import { IContactRepository } from '../../domain/repositories/IContactRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * DTO para chave PIX
 */
export interface PixKeyRequest {
  key: string;
  keyType: PixKeyType;
}

/**
 * DTO para criação de contato
 */
export interface CreateContactRequest {
  userId: string;
  name: string;
  pixKeys: PixKeyRequest[];
}

/**
 * DTO para resposta de criação de contato
 */
export interface CreateContactResponse {
  id: string;
  userId: string;
  name: string;
  pixKeys: {
    id: string;
    key: string;
    keyType: PixKeyType;
    isActive: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Caso de uso para criação de contatos
 */
export class CreateContactUseCase {
  constructor(
    private contactRepository: IContactRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Executa o caso de uso de criação de contato
   */
  async execute(request: CreateContactRequest): Promise<CreateContactResponse> {
    // Validações de entrada
    this.validateRequest(request);

    // Verifica se o usuário existe
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica se já existe um contato com o mesmo nome para o usuário
    const existingContact = await this.contactRepository.findByNameAndUserId(
      request.name,
      request.userId
    );
    if (existingContact) {
      throw new Error('Já existe um contato com este nome');
    }

    // Valida as chaves PIX
    this.validatePixKeys(request.pixKeys);

    // Cria as chaves PIX
    const pixKeys = request.pixKeys.map(pixKeyData => 
      new PixKey(
        '', // ID será gerado pelo repositório
        pixKeyData.key,
        pixKeyData.keyType,
        true
      )
    );

    // Cria o contato
    const contactData = Contact.create(request.userId, request.name, pixKeys);
    const contact = await this.contactRepository.create(contactData);

    // Retorna a resposta
    return {
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      pixKeys: contact.pixKeys.map(key => ({
        id: key.id,
        key: key.key,
        keyType: key.keyType,
        isActive: key.isActive
      })),
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    };
  }

  /**
   * Valida os dados de entrada
   */
  private validateRequest(request: CreateContactRequest): void {
    if (!request.userId) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!request.name || request.name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!request.pixKeys || request.pixKeys.length === 0) {
      throw new Error('Pelo menos uma chave PIX é obrigatória');
    }

    if (request.pixKeys.length > 5) {
      throw new Error('Máximo de 5 chaves PIX por contato');
    }
  }

  /**
   * Valida as chaves PIX
   */
  private validatePixKeys(pixKeys: PixKeyRequest[]): void {
    const uniqueKeys = new Set<string>();
    const uniqueTypes = new Set<PixKeyType>();

    for (const pixKey of pixKeys) {
      // Verifica se a chave é única
      if (uniqueKeys.has(pixKey.key)) {
        throw new Error('Chaves PIX devem ser únicas');
      }
      uniqueKeys.add(pixKey.key);

      // Verifica se o tipo de chave é único
      if (uniqueTypes.has(pixKey.keyType)) {
        throw new Error('Tipos de chave PIX devem ser únicos');
      }
      uniqueTypes.add(pixKey.keyType);

      // Valida a chave PIX
      this.validatePixKey(pixKey.key, pixKey.keyType);
    }
  }

  /**
   * Valida uma chave PIX específica
   */
  private validatePixKey(key: string, keyType: PixKeyType): void {
    switch (keyType) {
      case PixKeyType.CPF:
        if (!this.isValidCpf(key)) {
          throw new Error('CPF inválido');
        }
        break;
      case PixKeyType.EMAIL:
        if (!this.isValidEmail(key)) {
          throw new Error('Email inválido');
        }
        break;
      case PixKeyType.PHONE:
        if (!this.isValidPhone(key)) {
          throw new Error('Telefone inválido');
        }
        break;
      case PixKeyType.RANDOM:
        if (!this.isValidRandomKey(key)) {
          throw new Error('Chave aleatória inválida');
        }
        break;
      default:
        throw new Error('Tipo de chave PIX inválido');
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
    
    return parseInt(cleanCpf.charAt(9)) === digit1 && parseInt(cleanCpf.charAt(10)) === digit2;
  }

  /**
   * Valida formato de telefone
   */
  private isValidPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }

  /**
   * Valida formato de chave aleatória
   */
  private isValidRandomKey(key: string): boolean {
    return key.length >= 32 && key.length <= 77;
  }
} 