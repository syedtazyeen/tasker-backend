import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Tasker API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
