import { Module } from '@nestjs/common';
import { ShorteningController } from './shortening.controller';
import { ShorteningService } from './shortening.service';
import { Md5ShorteningStrategy } from './strategies/md5-encode/md5-encode.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from '@database/entities/url.entity';
import { UrlRepository } from './repository/url.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity])
  ],
  controllers: [ShorteningController],
  providers: [
    ShorteningService,
    {
      provide: 'SHORTENING_STRATEGY',
      useClass: Md5ShorteningStrategy,
    },
    UrlRepository
  ],
})
export class ShorteningModule {}
