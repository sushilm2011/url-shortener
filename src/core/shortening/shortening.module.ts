import { Module } from '@nestjs/common';
import { ShorteningController } from './shortening.controller';
import { ShorteningService } from './shortening.service';
import { Md5ShorteningStrategy } from './strategies/md5-encode.strategy';

@Module({
  controllers: [ShorteningController],
  providers: [
    ShorteningService,
    {
      provide: 'SHORTENING_STRATEGY',
      useClass: Md5ShorteningStrategy,
    },
  ],
})
export class ShorteningModule {}
