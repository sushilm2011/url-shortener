import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from '@config/swagger.config';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters';
import {
  RequestLoggerInterceptor,
  ResponseTransformInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: '*',
    methods: ['OPTION', 'HEAD', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: '*',
    preflightContinue: false,
    credentials: true,
  });

  const port = configService.get<number>('API_PORT');
  const prefix = configService.get<string>('API_PREFIX');
  const service = configService.get<string>('SERVICE_NAME');

  app.useGlobalFilters(new HttpExceptionFilter({}));
  app.useGlobalInterceptors(
    new RequestLoggerInterceptor(),
    new ResponseTransformInterceptor({}),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix(prefix, {
    exclude: [{ path: '/:alias', method: RequestMethod.GET }],
  });

  configSwagger(app, configService);
  await app.listen(port);
  return { port, service };
}

bootstrap().then((data: { port: number; service: string }) => {
  Logger.log(`${data.service} is running on port: ${data.port}`, 'Main');
});
