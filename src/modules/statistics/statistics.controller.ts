import { PaginationQueryDto } from '@common/dtos/pagination-request.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './services/statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Get('/url')
  public async getStats(@Query() queryDto: PaginationQueryDto) {
    return this.statisticsService.getUrlSummary(queryDto);
  }
}
