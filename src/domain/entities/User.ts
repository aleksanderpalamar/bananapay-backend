/**
 * Entidade que representa um usuário no sistema
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Cria uma nova instância de User
   */
  static create(
    name: string,
    email: string,
    cpf: string
  ): {
    name: string;
    email: string;
    cpf: string;
  } {
    return {
      name,
      email,
      cpf,
    };
  }

  /**
   * Valida se o email é válido
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Valida se o CPF é válido
   */
  isValidCpf(): boolean {
    const cpf = this.cpf.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;

    // Validação do segundo dígito verificador
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
}
