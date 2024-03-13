import { Module } from '@nestjs/common';
import { RedirectionController } from './redirection.controller';
import { ShorteningModule } from 'src/modules/shortening/shortening.module';
import { RedirectionService } from './services/redirection.service';
import { QueueModule } from '@modules/queue/queue.module';
import { CounterCacheModule } from '@modules/counter-cache/counter-cache.module';

@Module({
  imports: [ShorteningModule, QueueModule, CounterCacheModule],
  controllers: [RedirectionController],
  providers: [RedirectionService],
})
export class RedirectionModule {}
