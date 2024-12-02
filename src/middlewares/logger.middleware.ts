import { logger } from '@/src/lib/logger';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export default class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    logger.info(`[REQUEST : ${req.method}] ${req.originalUrl}`);

    res.on('finish', () => {
      if (res.statusCode < 300) {
        logger.info(
          `[RESPONSE : ${req.method}] ${req.originalUrl} | ${res.statusCode} - ${res.statusMessage}`,
        );
        return;
      }
      if (res.statusCode < 400) {
        logger.warn(
          `[RESPONSE : ${req.method}] ${req.originalUrl} | ${res.statusCode} - ${res.statusMessage}`,
        );
        return;
      } else
        logger.error(
          `[RESPONSE : ${req.method}] ${req.originalUrl} | ${res.statusCode} - ${res.statusMessage}`,
        );
      return;
    });

    next();
  }
}
