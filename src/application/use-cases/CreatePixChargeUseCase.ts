import { PixCharge } from "../../domain/entities/PixCharge";
import { IPixService } from "../../domain/repositories/IPixService";

/**
 * DTO para criação de cobrança Pix
 */
export interface CreatePixChargeRequest {
  value: number;
  payerName: string;
  payerCpf: string;
  payerEmail: string;
  description: string;
  expirationMinutes?: number; // Tempo de expiração em minutos (padrão: 60)
}

/**
 * DTO para resposta de criação de cobrança Pix
 */
export interface CreatePixChargeResponse {
  id: string;
  txid: string;
  locationUrl: string;
  status: string;
  value: number;
  payerName: string;
  payerCpf: string;
  payerEmail: string;
  description: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Caso de uso para criação de cobranças Pix
 */
export class CreatePixChargeUseCase {
  constructor(private pixService: IPixService) {}

  /**
   * Executa o caso de uso de criação de cobrança Pix
   */
  async execute(
    request: CreatePixChargeRequest
  ): Promise<CreatePixChargeResponse> {
    // Validações de entrada
    this.validateRequest(request);

    // Calcula data de expiração
    const expirationMinutes = request.expirationMinutes || 60;
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    // Cria os dados da cobrança
    const chargeData = {
      value: request.value,
      payerName: request.payerName,
      payerCpf: request.payerCpf,
      payerEmail: request.payerEmail,
      description: request.description,
      expiresAt,
    };

    // Cria a cobrança através do serviço Pix
    const pixCharge = await this.pixService.createCharge(chargeData);

    // Retorna a resposta
    return {
      id: pixCharge.id,
      txid: pixCharge.txid,
      locationUrl: pixCharge.locationUrl,
      status: pixCharge.status,
      value: pixCharge.value,
      payerName: pixCharge.payerName,
      payerCpf: pixCharge.payerCpf,
      payerEmail: pixCharge.payerEmail,
      description: pixCharge.description,
      expiresAt: pixCharge.expiresAt,
      createdAt: pixCharge.createdAt,
    };
  }

  /**
   * Valida os dados de entrada
   */
  private validateRequest(request: CreatePixChargeRequest): void {
    if (!request.value || request.value <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    if (request.value > 1000000) {
      throw new Error("Valor máximo permitido é R$ 1.000.000,00");
    }

    if (!request.payerName || request.payerName.trim().length < 2) {
      throw new Error("Nome do pagador deve ter pelo menos 2 caracteres");
    }

    if (request.payerName.length > 100) {
      throw new Error("Nome do pagador deve ter no máximo 100 caracteres");
    }

    if (!request.payerCpf || !this.isValidCpf(request.payerCpf)) {
      throw new Error("CPF do pagador inválido");
    }

    if (!request.payerEmail || !this.isValidEmail(request.payerEmail)) {
      throw new Error("Email do pagador inválido");
    }

    if (!request.description || request.description.trim().length === 0) {
      throw new Error("Descrição é obrigatória");
    }

    if (request.description.length > 200) {
      throw new Error("Descrição deve ter no máximo 200 caracteres");
    }

    if (
      request.expirationMinutes !== undefined &&
      (request.expirationMinutes < 1 || request.expirationMinutes > 43200)
    ) {
      throw new Error(
        "Tempo de expiração deve estar entre 1 minuto e 30 dias (43200 minutos)"
      );
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
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    // Validação dos dígitos verificadores
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

    return (
      parseInt(cleanCpf.charAt(9)) === digit1 &&
      parseInt(cleanCpf.charAt(10)) === digit2
    );
  }
}
