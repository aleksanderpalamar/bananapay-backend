import { Router } from "express";
import { TransactionController } from "../controllers/TransactionController";

export function createTransactionRoutes(
  transactionController: TransactionController
): Router {
  const router = Router();

  router.post("/", (req, res) => transactionController.create(req, res));
  router.get("/", (req, res) => transactionController.findAll(req, res));
  router.get("/user/:userId", (req, res) =>
    transactionController.findByUserId(req, res)
  );
  router.get("/:id", (req, res) => transactionController.findById(req, res));
  router.post("/:id/execute", (req, res) =>
    transactionController.execute(req, res)
  );
  router.post("/:id/cancel", (req, res) =>
    transactionController.cancel(req, res)
  );

  return router;
}
