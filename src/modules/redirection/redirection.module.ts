import { Module } from '@nestjs/common';
import { RedirectionController } from './redirection.controller';
import { ShorteningModule } from 'src/modules/shortening/shortening.module';
import { RedirectionService } from './redirection.service';

@Module({
  imports: [ShorteningModule],
  controllers: [RedirectionController],
  providers: [RedirectionService],
})
export class RedirectionModule {}
