import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { options } from './orm.config';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
export const defaultConnection = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  ...options,
  autoLoadEntities: config.get('TYPEORM_AUTOLOAD'),
});
