import { Router } from "express";
import { ContactController } from "../controllers/ContactController";

export function createContactRoutes(
  contactController: ContactController
): Router {
  const router = Router();

  router.post("/", (req, res) => contactController.create(req, res));
  router.get("/", (req, res) => contactController.findAll(req, res));
  router.get("/user/:userId", (req, res) =>
    contactController.findByUserId(req, res)
  );
  router.get("/:id", (req, res) => contactController.findById(req, res));
  router.put("/:id", (req, res) => contactController.update(req, res));
  router.delete("/:id", (req, res) => contactController.delete(req, res));

  return router;
}
