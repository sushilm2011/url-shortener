import { cacheConnection } from '@config/redis.config';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService) => cacheConnection(configService),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class UrlCacheModule {}
