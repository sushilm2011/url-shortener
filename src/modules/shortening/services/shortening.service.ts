import {
  ConflictException,
  Inject,
  Injectable,
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

@Injectable()
export class ShorteningService {
  constructor(
    @Inject('SHORTENING_STRATEGY')
    private shorteningStrategy: IShorteningStrategy,
    @Inject('SHORTENING_ATTEMPTS')
    private shorteningAttempts: number,
    private urlRepository: UrlRepository,
    private urlMapper: UrlMapper,
  ) {}

  public async shortenUrl(shortenReqDto: ShortenRequestDto) {
    const alias = await this.generateAlias(shortenReqDto.longUrl);
    if (alias) {
      const urlEntityToSave = this.urlMapper.toEntity(
        shortenReqDto,
        alias,
      );
      const savedUrlEntity = await this.urlRepository.saveUrl(urlEntityToSave);
      return this.urlMapper.toDto(savedUrlEntity);
    }

    throw new RequestTimeoutException();
  }

  public async renameUrl(renameReqDto: RenameRequestDto) {
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
    const urlEntity = await this.urlRepository.getByAlias(shortAlias);
    if (!urlEntity) {
      throw new NotFoundException();
    }

    return urlEntity;
  }

  public async getUrls(queryDto: PaginationQueryDto) {
    return this.urlRepository.getUrls(queryDto);
  }

  public async incrScore(shortAlias: string) {
    return this.urlRepository.incrVisitCount(shortAlias);
  }

  public async delete(shortAlias: string) {
    // Throws if not found
    const url = await this.getUrl(shortAlias);
    return this.urlRepository.softDelete(url.id);
  }
}
