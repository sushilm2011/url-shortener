import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';
import { Injectable } from '@nestjs/common';
import { StatisticsMapper } from './mappers/statistics.mapper';
import { StatisticsRepository } from './repository/statistics.repository';

@Injectable()
export class StatisticsService {
  constructor(
    private statisticsMapper: StatisticsMapper,
    private statisticsRepo: StatisticsRepository,
  ) {}

  public async saveLinkAccessStats(statsData: LinkAccessEventDto) {
    const linkAccessEventEntity = this.statisticsMapper.toEntity(statsData);
    await this.statisticsRepo.saveEvent(linkAccessEventEntity);
  }
}
