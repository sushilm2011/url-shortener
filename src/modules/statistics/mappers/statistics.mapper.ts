import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';
import { LinkAccessEventEntity } from '@database/entities/statistics.entity';

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
}
