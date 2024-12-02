import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { logger } from './logger';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const response = context.switchToHttp().getResponse();
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
          error instanceof HttpException
            ? error.message || error.getResponse()
            : 'An unexpected error occurred';

        const data = error?.response?.message;

        logger.error(`Error: ${message}`);

        response.status(statusCode).json({
          statusCode,
          message,
          data,
          error: error.name || 'InternalServerError',
          timestamp: new Date().toISOString(),
        });

        return throwError(() => error);
      }),
    );
  }
}
