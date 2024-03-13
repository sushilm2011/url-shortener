import { ShorteningService } from 'src/modules/shortening/services/shortening.service';
import { Injectable, Logger } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';
import { LINK_ACCESS_EVENTS_QUEUE, LINK_ACCESS_EVENT_TYPE } from '@common/constants/queue.constants';
import { Queue } from "bull";
import { InjectQueue } from '@nestjs/bull';
import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';

@Injectable()
export class RedirectionService {
  constructor(
    private shorteningService: ShorteningService,
    @InjectQueue(LINK_ACCESS_EVENTS_QUEUE)
    private linkAccessEventQueue: Queue
  ) {}

  public async getLongUrl(shortAlias: string, req: Request) {
    const longUrl = await this.shorteningService.getLongUrl(shortAlias);
    this.publishAccessEvent(longUrl, shortAlias, req.headers);
    return longUrl;
  }

  public async publishAccessEvent(
    longUrl: string,
    shortAlias: string,
    reqHeaders: IncomingHttpHeaders,
  ) {
    const logContext = `publishAccessEvent:${shortAlias}`;
    try {
      const event = new LinkAccessEventDto(
        longUrl, shortAlias, reqHeaders
      );
      const eventOptions = {
        removeOnComplete: true, timeout: 10000
      }
      await this.linkAccessEventQueue.add(LINK_ACCESS_EVENT_TYPE, event, eventOptions);
    } catch(err) {
      Logger.error(`Error while publishing event to linkAccessEventQueue ${err}`, logContext);
    }
  }
}
