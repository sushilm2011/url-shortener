import {
  LINK_ACCESS_EVENTS_QUEUE,
  LINK_ACCESS_EVENT_TYPE,
} from '@common/constants/queue.constants';
import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { StatisticsService } from './services/statistics.service';

@Processor(LINK_ACCESS_EVENTS_QUEUE)
export class LinkAccessEventProcessor {
  constructor(private statisticsService: StatisticsService) {}

  @Process(LINK_ACCESS_EVENT_TYPE)
  public async handleAccessEvent(job: Job<LinkAccessEventDto>) {
    const context = 'LinkAccessEventProcessor:handleAccessEvent';
    Logger.log(`Start`, context);
    try {
      const jobData = job.data;
      Logger.log(`Found job data ${JSON.stringify(jobData)}`, context);
      await this.statisticsService.saveLinkAccessStats(jobData);
    } catch (err) {
      Logger.error(
        `Error while processing event ${JSON.stringify(job.data)} ${err}`,
        err,
        context,
      );
    }
    Logger.log(`End`, context);
  }
}
