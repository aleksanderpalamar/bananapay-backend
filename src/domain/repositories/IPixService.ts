/**
 * Interface que define os contratos do serviço de integração com a API Pix do Banco do Brasil
 */
import { PixCharge, PixChargeStatus } from "../entities/PixCharge";

export interface IPixService {
  /**
   * Cria uma nova cobrança Pix
   * @param charge Dados para criação da cobrança
   */
  createCharge(
    charge: Omit<
      PixCharge,
      "id" | "txid" | "locationUrl" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<PixCharge>;

  /**
   * Consulta uma cobrança Pix pelo txid
   * @param txid Identificador da transação Pix
   */
  getChargeByTxid(txid: string): Promise<PixCharge | null>;

  /**
   * Consulta cobranças Pix por status
   * @param status Status da cobrança
   */
  getChargesByStatus(status: PixChargeStatus): Promise<PixCharge[]>;

  /**
   * Cancela uma cobrança Pix
   * @param txid Identificador da transação Pix
   */
  cancelCharge(txid: string): Promise<void>;
}
