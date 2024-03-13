import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { LinkAccessEventProcessor } from './link-access-event.processor';
import { QueueModule } from '@modules/queue/queue.module';
import { StatisticsMapper } from './mappers/statistics.mapper';
import { StatisticsRepository } from './repository/statistics.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkAccessEventEntity } from '@database/entities/statistics.entity';
import { StatisticsController } from './statistics.controller';
import { ShorteningModule } from '@modules/shortening/shortening.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkAccessEventEntity]),
    QueueModule,
    ShorteningModule,
  ],
  providers: [
    StatisticsService,
    LinkAccessEventProcessor,
    StatisticsMapper,
    StatisticsRepository,
  ],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
