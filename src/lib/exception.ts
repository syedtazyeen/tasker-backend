import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: any = exception.getResponse
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      status: status,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : message?.message,
    });
  }
}
