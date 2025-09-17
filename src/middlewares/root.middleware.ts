import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RootMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/' && req.method === 'GET') {
      return res.json({
        message: 'Flower Delivery Backend API',
        api: '/api/v1',
        docs: '/api',
        status: 'OK',
      });
    }
    next();
  }
}
