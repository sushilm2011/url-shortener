import { ShorteningService } from 'src/modules/shortening/services/shortening.service';
import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class RedirectionService {
  constructor(
    private shorteningService: ShorteningService
  ) { }

  public async getLongUrl(shortAlias: string) {
    const longUrl = await this.shorteningService.getLongUrl(shortAlias);
    return longUrl;
  }

  public async publishAccessEvent(
    longUrl: string,
    shortAlias: string,
    reqHeaders: IncomingHttpHeaders
  ) {

  }
}
