import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

/**
 * Middleware para tratamento de erros
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log do erro
  logger.error("Erro na aplicação:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Se já foi enviada uma resposta, não faz nada
  if (res.headersSent) {
    return next(error);
  }

  // Resposta de erro padrão
  res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
}

/**
 * Middleware para capturar erros assíncronos
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
