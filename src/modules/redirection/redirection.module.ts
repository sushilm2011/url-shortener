import { Module } from '@nestjs/common';
import { RedirectionController } from './redirection.controller';
import { ShorteningModule } from 'src/modules/shortening/shortening.module';
import { RedirectionService } from './redirection.service';
import { QueueModule } from '@modules/queue/queue.module';

@Module({
  imports: [ShorteningModule, QueueModule],
  controllers: [RedirectionController],
  providers: [RedirectionService],
})
export class RedirectionModule {}
