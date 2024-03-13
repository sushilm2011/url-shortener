import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';
import { LinkAccessEventEntity } from '@database/entities/statistics.entity';
import { UrlEntity } from '@database/entities/url.entity';
import { IUrlSummary } from '../interfaces/url-summary.interface';
import { UrlSummaryResponseDto } from '../dtos/url-summary.response.dto';

export class StatisticsMapper {
  public toEntity(statsData: LinkAccessEventDto) {
    const linkAccessEventEntity = new LinkAccessEventEntity();

    linkAccessEventEntity.accessTimestamp = new Date(statsData.timestamp);
    linkAccessEventEntity.alias = statsData.shortAlias;
    linkAccessEventEntity.host = statsData.reqHeaders?.host;
    linkAccessEventEntity.ip = statsData.reqHeaders?.ip as string;
    linkAccessEventEntity.language = statsData.reqHeaders['accept-language'];
    linkAccessEventEntity.longUrl = statsData.longUrl;
    linkAccessEventEntity.platform = statsData.reqHeaders[
      'sec-ch-ua-platform'
    ] as string;
    linkAccessEventEntity.referrer = statsData.reqHeaders.referer;
    linkAccessEventEntity.requestId = statsData.reqHeaders[
      'x-request-id'
    ] as string;
    linkAccessEventEntity.userAgent = statsData.reqHeaders['user-agent'];

    return linkAccessEventEntity;
  }

  public toSummaryDto(urls: UrlEntity[], urlSummaries: IUrlSummary[]) {
    return urls.map((url) => {
      const urlSummary = urlSummaries.find(
        (uS) => uS.longUrl === url.longUrl && uS.shortAlias === url.alias,
      );

      const urlSummaryResponseDto = new UrlSummaryResponseDto();
      urlSummaryResponseDto.id = url.id;
      urlSummaryResponseDto.createdAt = url.createdAt;
      urlSummaryResponseDto.clicks = urlSummary?.clicks || 0;
      urlSummaryResponseDto.longUrl = url.longUrl;
      urlSummaryResponseDto.recentAccess = urlSummary?.recentAccess || null;
      urlSummaryResponseDto.shortAlias = url.alias;
      urlSummaryResponseDto.requestLimit = url.requestLimit;

      return urlSummaryResponseDto;
    });
  }
}
