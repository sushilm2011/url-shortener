import { UrlEntity } from '@database/entities/url.entity';
import { ShortenResponseDto } from '../dtos/shorten-response.dto';
import { ShortenRequestDto } from '../dtos/shorten-request.dto';

export class UrlMapper {
  public toEntity(shortenReqDto: ShortenRequestDto, alias: string) {
    const urlEntity = new UrlEntity();
    urlEntity.longUrl = shortenReqDto.longUrl;
    urlEntity.alias = alias;
    urlEntity.requestLimit = shortenReqDto.requestLimit;
    return urlEntity;
  }

  public toDto(urlEntity: UrlEntity) {
    const urlDto = new ShortenResponseDto();
    urlDto.alias = urlEntity.alias;
    urlDto.longUrl = urlEntity.longUrl;
    urlDto.requestLimit = urlEntity.requestLimit;
    return urlDto;
  }
}
