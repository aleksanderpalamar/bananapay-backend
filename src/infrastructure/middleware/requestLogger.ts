import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Middleware para logging de requisições
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log da requisição
  logger.info('Requisição recebida', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Intercepta o final da resposta
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Resposta enviada', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
} 