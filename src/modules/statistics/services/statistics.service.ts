import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';
import { Injectable } from '@nestjs/common';
import { StatisticsMapper } from '../mappers/statistics.mapper';
import { StatisticsRepository } from '../repository/statistics.repository';
import { PaginationQueryDto } from '@common/dtos/pagination-request.dto';
import { ShorteningService } from '@modules/shortening/services/shortening.service';
import { getPaginationResponse } from '@common/utils/pagination.util';

@Injectable()
export class StatisticsService {
  constructor(
    private statisticsMapper: StatisticsMapper,
    private statisticsRepo: StatisticsRepository,
    private shorteningService: ShorteningService,
  ) {}

  public async saveLinkAccessStats(statsData: LinkAccessEventDto) {
    const linkAccessEventEntity = this.statisticsMapper.toEntity(statsData);
    await this.statisticsRepo.saveEvent(linkAccessEventEntity);
    await this.shorteningService.incrScore(statsData.shortAlias);
  }

  public async getUrlSummary(queryDto: PaginationQueryDto) {
    const [urls, total] = await this.shorteningService.getUrls(queryDto);
    const longUrls = urls.map((url) => url.longUrl);
    const urlSummaries = await this.statisticsRepo.getUrlSummary(longUrls);
    const mappedSummary = this.statisticsMapper.toSummaryDto(
      urls,
      urlSummaries,
    );
    return getPaginationResponse(queryDto, mappedSummary, total);
  }

  public async getAliasStats(shortAlias: string) {
    return this.statisticsRepo.getAliasEvents(shortAlias);
  }
}
