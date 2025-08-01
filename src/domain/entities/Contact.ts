/**
 * Entidade que representa um contato PIX no sistema
 */
export class Contact {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly pixKeys: PixKey[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Cria uma nova instância de Contact
   */
  static create(
    userId: string,
    name: string,
    pixKeys: PixKey[]
  ): {
    userId: string;
    name: string;
    pixKeys: PixKey[];
  } {
    return {
      userId,
      name,
      pixKeys,
    };
  }

  /**
   * Adiciona uma nova chave PIX ao contato
   */
  addPixKey(pixKey: PixKey): Contact {
    const updatedPixKeys = [...this.pixKeys, pixKey];
    return new Contact(
      this.id,
      this.userId,
      this.name,
      updatedPixKeys,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Remove uma chave PIX do contato
   */
  removePixKey(pixKeyId: string): Contact {
    const updatedPixKeys = this.pixKeys.filter((key) => key.id !== pixKeyId);
    return new Contact(
      this.id,
      this.userId,
      this.name,
      updatedPixKeys,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Verifica se o contato tem chaves PIX válidas
   */
  hasValidPixKeys(): boolean {
    return (
      this.pixKeys.length > 0 && this.pixKeys.every((key) => key.isValid())
    );
  }
}

/**
 * Value Object que representa uma chave PIX
 */
export class PixKey {
  constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly keyType: PixKeyType,
    public readonly isActive: boolean
  ) {}

  /**
   * Cria uma nova instância de PixKey
   */
  static create(
    key: string,
    keyType: PixKeyType
  ): {
    key: string;
    keyType: PixKeyType;
  } {
    return {
      key,
      keyType,
    };
  }

  /**
   * Valida se a chave PIX é válida
   */
  isValid(): boolean {
    if (!this.isActive) return false;

    switch (this.keyType) {
      case PixKeyType.CPF:
        return this.isValidCpf();
      case PixKeyType.EMAIL:
        return this.isValidEmail();
      case PixKeyType.PHONE:
        return this.isValidPhone();
      case PixKeyType.RANDOM:
        return this.isValidRandomKey();
      default:
        return false;
    }
  }

  private isValidCpf(): boolean {
    const cpf = this.key.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;

    return (
      parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2
    );
  }

  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.key);
  }

  private isValidPhone(): boolean {
    const phone = this.key.replace(/\D/g, "");
    return phone.length >= 10 && phone.length <= 11;
  }

  private isValidRandomKey(): boolean {
    // Chave aleatória deve ter entre 32 e 77 caracteres
    return this.key.length >= 32 && this.key.length <= 77;
  }
}

/**
 * Enum que define os tipos de chave PIX
 */
export enum PixKeyType {
  CPF = "CPF",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  RANDOM = "RANDOM",
}
