import { UrlEntity } from "@database/entities/url.entity";
import { ShortenResponseDto } from "../dtos/shorten-response.dto";

export class UrlMapper {
  public toEntity(
    longUrl: string, alias: string
  ) {
    const urlEntity = new UrlEntity();
    urlEntity.longUrl = longUrl;
    urlEntity.alias = alias;
    return urlEntity;
  }

  public toDto(
    urlEntity: UrlEntity
  ) {
    const urlDto = new ShortenResponseDto();
    urlDto.alias = urlEntity.alias;
    urlDto.longUrl = urlEntity.longUrl;
    return urlDto;
  }
}