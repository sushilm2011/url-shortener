import { Inject, Injectable } from '@nestjs/common';
import { ShortenRequestDto } from './dtos/shorten-request.dto';
import { IShorteningStrategy } from './strategies/encode.strategy';

@Injectable()
export class ShorteningService {
  constructor(
    @Inject('SHORTENING_STRATEGY')
    private shorteningStrategy: IShorteningStrategy,
  ) {}

  public async shortenUrl(shortenReqDto: ShortenRequestDto) {
    const shortUrl = this.shorteningStrategy.encode(shortenReqDto.longUrl);
    return shortUrl;
  }
}
