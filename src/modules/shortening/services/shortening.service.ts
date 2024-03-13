import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  RenameRequestDto,
  ShortenRequestDto,
} from '../dtos/shorten-request.dto';
import { IShorteningStrategy } from '../strategies/encode.strategy';
import { UrlRepository } from '../repository/url.repository';
import { UrlMapper } from '../mappers/url.mapper';
import { PaginationQueryDto } from '@common/dtos/pagination-request.dto';
import { UrlEntity } from '@database/entities/url.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ShorteningService {
  constructor(
    @Inject('SHORTENING_STRATEGY')
    private shorteningStrategy: IShorteningStrategy,
    @Inject('SHORTENING_ATTEMPTS')
    private shorteningAttempts: number,
    private urlRepository: UrlRepository,
    private urlMapper: UrlMapper,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  public async shortenUrl(shortenReqDto: ShortenRequestDto) {
    const alias = await this.generateAlias(shortenReqDto.longUrl);
    if (alias) {
      const urlEntityToSave = this.urlMapper.toEntity(shortenReqDto, alias);
      const savedUrlEntity = await this.urlRepository.saveUrl(urlEntityToSave);
      return this.urlMapper.toDto(savedUrlEntity);
    }

    throw new RequestTimeoutException();
  }

  public async renameUrl(renameReqDto: RenameRequestDto) {
    await this.deleteCache(renameReqDto.alias);

    const existingUrl = await this.urlRepository.getByAlias(renameReqDto.alias);
    if (!existingUrl) {
      throw new NotFoundException();
    }

    const existingCustomAlias = await this.urlRepository.getByAlias(
      renameReqDto.customAlias,
    );
    if (existingCustomAlias) {
      throw new ConflictException();
    }

    const urlEntityToSave = this.urlMapper.toEntity(
      { longUrl: existingUrl.longUrl, requestLimit: existingUrl.requestLimit },
      renameReqDto.customAlias,
    );

    const transactionManager = this.urlRepository.getEntityManager();
    let savedUrlEntity: UrlEntity;
    await transactionManager.transaction(async () => {
      existingUrl.isInactive = true;
      await this.urlRepository.saveUrl(existingUrl);
      savedUrlEntity = await this.urlRepository.saveUrl(urlEntityToSave);
    });

    return this.urlMapper.toDto(savedUrlEntity);
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
    } while (!alias && attempts > 0);

    return alias;
  }

  public async getUrl(shortAlias: string) {
    const cachedUrl = await this.getFromCache(shortAlias);
    if (cachedUrl) {
      return cachedUrl;
    }
    const urlEntity = await this.urlRepository.getByAlias(shortAlias);
    if (!urlEntity) {
      throw new NotFoundException();
    }
    // Update cache in background
    this.setCache(shortAlias, urlEntity);
    return urlEntity;
  }

  public async getUrls(queryDto: PaginationQueryDto) {
    return this.urlRepository.getUrls(queryDto);
  }

  public async incrScore(shortAlias: string) {
    await this.urlRepository.incrVisitCount(shortAlias);
    const urlEntity = await this.urlRepository.getByAlias(shortAlias);
    await this.setCache(shortAlias, urlEntity);
  }

  public async delete(shortAlias: string) {
    // Throws if not found
    const url = await this.getUrl(shortAlias);
    await this.deleteCache(shortAlias);
    return this.urlRepository.softDelete(url.id);
  }

  public async getFromCache(alias: string): Promise<UrlEntity> {
    try {
      return this.cache.get(`url:${alias}`);
    } catch (err) {
      Logger.error(`Error while getting value from cache for ${alias}`, err);
    }
  }

  public async setCache(alias: string, value: UrlEntity) {
    try {
      await this.cache.set(`url:${alias}`, value, 5 * 60 * 1000);
    } catch (err) {
      Logger.error(`Error while setting value to cache for ${alias}`, err);
    }
  }

  public async deleteCache(alias: string) {
    try {
      return this.cache.del(`url:${alias}`);
    } catch (err) {
      Logger.error(`Error while deleting value from cache for ${alias}`, err);
    }
  }
}
