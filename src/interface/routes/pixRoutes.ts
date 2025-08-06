import { Router } from "express";
import { PixController } from "../controllers/PixController";

/**
 * Cria as rotas de cobranças Pix
 */
export function createPixRoutes(pixController: PixController): Router {
  const router = Router();

  // POST /api/v1/pix/charges - Criar cobrança Pix
  router.post("/charges", (req, res) => pixController.createCharge(req, res));

  // GET /api/v1/pix/charges/:txid - Consultar cobrança Pix por TXID
  router.get("/charges/:txid", (req, res) =>
    pixController.getChargeByTxid(req, res)
  );

  // DELETE /api/v1/pix/charges/:txid - Cancelar cobrança Pix
  router.delete("/charges/:txid", (req, res) =>
    pixController.cancelCharge(req, res)
  );

  // GET /api/v1/pix/charges - Listar cobranças Pix por status
  router.get("/charges", (req, res) =>
    pixController.getChargesByStatus(req, res)
  );

  return router;
}
