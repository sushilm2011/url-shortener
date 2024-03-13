import { IncomingHttpHeaders } from 'http';

export class LinkAccessEventDto {
  longUrl: string;
  shortAlias: string;
  reqHeaders: IncomingHttpHeaders;
  timestamp: number;

  constructor(
    longUrl: string,
    shortAlias: string,
    reqHeaders: IncomingHttpHeaders,
  ) {
    this.longUrl = longUrl;
    this.shortAlias = shortAlias;
    this.reqHeaders = reqHeaders;
    this.timestamp = new Date().valueOf();
  }
}
