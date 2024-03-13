import {
  LINK_ACCESS_EVENTS_QUEUE,
  LINK_ACCESS_EVENT_PREFIX,
} from '@common/constants/queue.constants';
import { UrlCacheModule } from '@modules/cache/cache.module';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UrlCacheModule,
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
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
