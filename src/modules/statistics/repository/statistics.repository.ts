import { LinkAccessEventEntity } from '@database/entities/statistics.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class StatisticsRepository {
  constructor(
    @InjectRepository(LinkAccessEventEntity)
    private linkAccessEventsRepo: Repository<LinkAccessEventEntity>,
  ) {}

  private getRepo(transactionManager: EntityManager) {
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
}
