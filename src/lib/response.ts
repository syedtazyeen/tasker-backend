import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const message = statusMessages[statusCode];

    return next.handle().pipe(
      map((data) => ({
        message,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}

const statusMessages = {
  [HttpStatus.OK]: 'Request successful',
  [HttpStatus.CREATED]: 'Resource created successfully',
  [HttpStatus.NO_CONTENT]: 'Request successful, no content',
  [HttpStatus.BAD_REQUEST]: 'Bad request',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized access',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Resource not found',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service unavailable',
};
