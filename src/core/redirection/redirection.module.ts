import { Module } from '@nestjs/common';
import { RedirectionController } from './redirection.controller';
import { ShorteningModule } from '@core/shortening/shortening.module';

@Module({
  imports: [ShorteningModule],
  controllers: [RedirectionController],
})
export class RedirectionModule {}
