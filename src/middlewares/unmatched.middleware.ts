import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export default class UnmatchedMiddlware implements NestMiddleware {
  use() {
    throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
  }
}
