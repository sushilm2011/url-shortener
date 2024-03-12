import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';

/**
 * Setup default connection in the application
 * @param config {ConfigService}
 */
export const defaultConnection = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  ...ormConfig,
  autoLoadEntities: config.get('TYPEORM_AUTOLOAD'),
});
