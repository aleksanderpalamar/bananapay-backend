/**
 * Entidade que representa uma cobrança Pix no sistema
 */
export class PixCharge {
  /**
   * Cria uma nova instância de PixCharge
   * @param id Identificador único da cobrança
   * @param txid Identificador da transação Pix (txid)
   * @param locationUrl URL de localização da cobrança
   * @param status Status da cobrança (ex: ATIVA, CONCLUIDA, REMOVIDA_PELO_USUARIO_RECEBEDOR)
   * @param value Valor da cobrança
   * @param payerName Nome do pagador
   * @param payerCpf CPF do pagador
   * @param payerEmail Email do pagador
   * @param description Descrição da cobrança
   * @param expiresAt Data/hora de expiração da cobrança
   * @param createdAt Data/hora de criação
   * @param updatedAt Data/hora de atualização
   */
  constructor(
    public readonly id: string,
    public readonly txid: string,
    public readonly locationUrl: string,
    public readonly status: PixChargeStatus,
    public readonly value: number,
    public readonly payerName: string,
    public readonly payerCpf: string,
    public readonly payerEmail: string,
    public readonly description: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Cria uma nova cobrança Pix
   */
  static create(
    value: number,
    payerName: string,
    payerCpf: string,
    payerEmail: string,
    description: string,
    expiresAt: Date
  ): Omit<
    PixCharge,
    "id" | "txid" | "locationUrl" | "status" | "createdAt" | "updatedAt"
  > {
    return {
      value,
      payerName,
      payerCpf,
      payerEmail,
      description,
      expiresAt,
    };
  }
}

/**
 * Enum que define os status de uma cobrança Pix
 */
export enum PixChargeStatus {
  ATIVA = "ATIVA",
  CONCLUIDA = "CONCLUIDA",
  REMOVIDA_PELO_USUARIO_RECEBEDOR = "REMOVIDA_PELO_USUARIO_RECEBEDOR",
  REMOVIDA_PELO_PSP = "REMOVIDA_PELO_PSP",
  EXPIRADA = "EXPIRADA",
}
