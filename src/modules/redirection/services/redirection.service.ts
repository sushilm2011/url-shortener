import { ShorteningService } from '@modules/shortening/services/shortening.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';
import {
  LINK_ACCESS_EVENTS_QUEUE,
  LINK_ACCESS_EVENT_TYPE,
} from '@common/constants/queue.constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';

@Injectable()
export class RedirectionService {
  constructor(
    private shorteningService: ShorteningService,
    @InjectQueue(LINK_ACCESS_EVENTS_QUEUE)
    private linkAccessEventQueue: Queue,
  ) {}

  public async getLongUrl(shortAlias: string, req: Request) {
    const urlEntity = await this.shorteningService.getUrl(shortAlias);
    if (urlEntity.requestLimit && urlEntity.visitCount >= urlEntity.requestLimit) {
      throw HttpException.createBody('', 'This URL has reached its access limit.', HttpStatus.TOO_MANY_REQUESTS);
    }

    if (urlEntity.deleted) {
      // Use Gone status so that for SEO the crawlers know that it needs to be de-indexed
      throw HttpException.createBody('', 'This link is no longer available.', HttpStatus.GONE);
    }

    this.publishAccessEvent(urlEntity.longUrl, shortAlias, req.headers);
    return urlEntity.longUrl;
  }

  private async publishAccessEvent(
    longUrl: string,
    shortAlias: string,
    reqHeaders: IncomingHttpHeaders,
  ) {
    const logContext = `publishAccessEvent:${shortAlias}`;
    try {
      const event = new LinkAccessEventDto(longUrl, shortAlias, reqHeaders);
      const eventOptions = {
        removeOnComplete: true,
        timeout: 10000,
      };
      await this.linkAccessEventQueue.add(
        LINK_ACCESS_EVENT_TYPE,
        event,
        eventOptions,
      );
    } catch (err) {
      Logger.error(
        `Error while publishing event to linkAccessEventQueue ${err}`,
        logContext,
      );
    }
  }
}
