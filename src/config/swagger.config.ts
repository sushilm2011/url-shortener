import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AUTH_OPTIONS, TOKEN_NAME } from 'src/common/constants/auth';

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const configSwagger = (
  app: INestApplication,
  configService: ConfigService,
) => {
  const title = configService.get<string>('API_SWAGGER_TITLE');
  const description = configService.get<string>('API_SWAGGER_DESCRIPTION');
  const version = configService.get<string>('API_SWAGGER_VERSION');
  const apiDoc = configService.get<string>('API_SWAGGER_DOC');

  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(AUTH_OPTIONS, TOKEN_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(apiDoc, app, document);
};
