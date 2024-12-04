import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { logger } from '@/src/lib/logger';
import { ResponseInterceptor } from '@/src/lib/response';
import { swaggerConfig } from '@/src/lib/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingMiddleware } from './middlewares';
import { ErrorInterceptor } from './lib/error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor(), new ErrorInterceptor());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api',
  });
  app.enableCors({ origin: '*' });
  app.use(new LoggingMiddleware().use);

  // Set up Swagger
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, options);

  const port = process.env.PORT || 3010;
  await app.listen(port);

  logger.ascii('! Application started !', () => {
    logger.info(`Application is running on port ${port}`);
  });
}

bootstrap();
