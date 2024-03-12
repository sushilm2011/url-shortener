import { Inject, Injectable, InternalServerErrorException, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { ShortenRequestDto } from './dtos/shorten-request.dto';
import { IShorteningStrategy } from './strategies/encode.strategy';
import { UrlRepository } from './repository/url.repository';
import { UrlMapper } from './mappers/url.mapper';

@Injectable()
export class ShorteningService {
  constructor(
    @Inject('SHORTENING_STRATEGY')
    private shorteningStrategy: IShorteningStrategy,
    @Inject('SHORTENING_ATTEMPTS')
    private shorteningAttempts: number,
    private urlRepository: UrlRepository,
    private urlMapper: UrlMapper
  ) {}

  public async shortenUrl(shortenReqDto: ShortenRequestDto) {
    const alias = await this.generateAlias(shortenReqDto.longUrl);
    if (alias) {
      const urlEntityToSave = this.urlMapper.toEntity(shortenReqDto.longUrl, alias);
      const savedUrlEntity = await this.urlRepository.saveUrl(urlEntityToSave);
      return this.urlMapper.toDto(savedUrlEntity);
    }

    throw new RequestTimeoutException();
  }

  private async generateAlias(longUrl: string) {
    let alias: string;
    let attempts = this.shorteningAttempts;

    // Attempt to generate url until and unless we get a unique url or the attempts are exchausted
    do {
      const shortAlias = this.shorteningStrategy.encode(longUrl);
      const existingUrl = await this.urlRepository.getByAlias(shortAlias);
      if (!existingUrl) {
        alias = shortAlias;
      }
      attempts--;
    } while(!alias && attempts > 0);

    return alias;
  }

  public async getLongUrl(shortAlias: string) {
    const urlEntity = await this.urlRepository.getByAlias(shortAlias);
    if (!urlEntity) {
      throw new NotFoundException();
    }

    return urlEntity.longUrl;
  }
}
