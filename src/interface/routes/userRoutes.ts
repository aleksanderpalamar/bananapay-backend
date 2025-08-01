import { Router } from "express";
import { UserController } from "../controllers/UserController";

/**
 * Cria as rotas de usuários
 */
export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // POST /api/v1/users - Criar usuário
  router.post("/", (req, res) => userController.create(req, res));

  // GET /api/v1/users - Listar todos os usuários
  router.get("/", (req, res) => userController.findAll(req, res));

  // GET /api/v1/users/:id - Buscar usuário por ID
  router.get("/:id", (req, res) => userController.findById(req, res));

  // PUT /api/v1/users/:id - Atualizar usuário
  router.put("/:id", (req, res) => userController.update(req, res));

  // DELETE /api/v1/users/:id - Remover usuário
  router.delete("/:id", (req, res) => userController.delete(req, res));

  return router;
}
