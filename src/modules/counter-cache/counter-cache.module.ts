import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CounterCacheService } from './counter-cache.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'IO_REDIS_OPTIONS',
      useFactory: (configService: ConfigService) => ({
        url: `redis://${configService.get('REDIS_HOST')}:${configService.get(
          'REDIS_PORT',
        )}`,
      }),
      inject: [ConfigService],
    },
    CounterCacheService,
  ],
  exports: [CounterCacheService],
})
export class CounterCacheModule {}
