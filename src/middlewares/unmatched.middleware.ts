import { NextFunction } from 'express';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export default class UnmatchedMiddlware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
  }
}
