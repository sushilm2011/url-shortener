import { LinkAccessEventEntity } from '@database/entities/statistics.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IUrlSummary } from '../interfaces/url-summary.interface';

export class StatisticsRepository {
  constructor(
    @InjectRepository(LinkAccessEventEntity)
    private linkAccessEventsRepo: Repository<LinkAccessEventEntity>,
  ) {}

  private getRepo(transactionManager?: EntityManager) {
    return transactionManager
      ? transactionManager.getRepository(LinkAccessEventEntity)
      : this.linkAccessEventsRepo;
  }

  public async saveEvent(
    linkAccessEventEntity: LinkAccessEventEntity,
    transactionManager?: EntityManager,
  ) {
    return this.getRepo(transactionManager).save(linkAccessEventEntity);
  }

  public async getUrlSummary(longUrls: string[]): Promise<IUrlSummary[]> {
    if (!longUrls || !longUrls.length) {
      return [];
    }

    const qb = this.getRepo().createQueryBuilder('lae');
    qb.select('lae.longUrl', 'longUrl')
      .addSelect('lae.alias', 'shortAlias')
      .addSelect('count(*)::int', 'clicks')
      .addSelect('max(lae.accessTimestamp)', 'recentAccess');
    qb.groupBy('lae.longUrl').addGroupBy('lae.alias');
    qb.having('lae.longUrl in (:...longUrls)', { longUrls });

    return qb.getRawMany();
  }
}
