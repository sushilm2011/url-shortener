import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const cacheConnection = (config: ConfigService): CacheModuleOptions => ({
  isGlobal: true,
  socket: {
    host: config.get<string>('REDIS_HOST'),
    port: config.get<string>('REDIS_PORT'),
  },
  store: redisStore,
});
