import { Module } from '@nestjs/common';
import { ShorteningController } from './shortening.controller';
import { ShorteningService } from './services/shortening.service';
import { Md5ShorteningStrategy } from './strategies/md5-encode/md5-encode.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from '@database/entities/url.entity';
import { UrlRepository } from './repository/url.repository';
import { UrlMapper } from './mappers/url.mapper';
import { UrlCacheModule } from '@modules/cache/cache.module';

@Module({
  imports: [UrlCacheModule, TypeOrmModule.forFeature([UrlEntity])],
  controllers: [ShorteningController],
  providers: [
    ShorteningService,
    {
      provide: 'SHORTENING_STRATEGY',
      useClass: Md5ShorteningStrategy,
    },
    {
      provide: 'SHORTENING_ATTEMPTS',
      useValue: 10,
    },
    UrlRepository,
    UrlMapper,
  ],
  exports: [ShorteningService],
})
export class ShorteningModule {}
