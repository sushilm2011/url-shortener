import { LINK_ACCESS_EVENTS_QUEUE, LINK_ACCESS_EVENT_PREFIX } from '@common/constants/queue.constants';
import { cacheConnection } from '@config/redis.config';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: configService => cacheConnection(configService),
      inject: [ConfigService]
    }),
    BullModule.registerQueueAsync({
      name: LINK_ACCESS_EVENTS_QUEUE,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const bullRootModuleOptions: BullModuleOptions = {};
        bullRootModuleOptions.redis = {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        };
        bullRootModuleOptions.prefix = LINK_ACCESS_EVENT_PREFIX;
        return bullRootModuleOptions;
      },
      inject: [ConfigService]
    }),
  ],
  exports: [BullModule]
})
export class QueueModule {}
