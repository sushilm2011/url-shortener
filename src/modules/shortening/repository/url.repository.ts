import { PaginationQueryDto } from '@common/dtos/pagination-request.dto';
import { UrlEntity } from '@database/entities/url.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UrlRepository {
  constructor(
    @InjectRepository(UrlEntity)
    private urlRepo: Repository<UrlEntity>,
  ) {}

  private getRepo(transactionManager?: EntityManager) {
    return transactionManager
      ? transactionManager.getRepository(UrlEntity)
      : this.urlRepo;
  }

  public getEntityManager() {
    return this.getRepo().manager;
  }

  public async saveUrl(
    urlEntity: UrlEntity,
    transactionManager?: EntityManager,
  ) {
    return this.getRepo(transactionManager).save(urlEntity);
  }

  public async getById(id: string, transactionManager?: EntityManager) {
    const whereOptions: FindOptionsWhere<UrlEntity> = { id };
    return this.getRepo(transactionManager).findOne({ where: whereOptions });
  }

  public async getByAlias(
    alias: string,
    includeInactive?: boolean,
    transactionManager?: EntityManager,
  ) {
    const whereOptions: FindOptionsWhere<UrlEntity> = {};
    whereOptions.alias = alias;

    if (!includeInactive) {
      whereOptions.isInactive = false;
    }

    return this.getRepo(transactionManager).findOne({ where: whereOptions });
  }

  public async getByLongUrl(
    longUrl: string,
    transactionManager?: EntityManager,
  ) {
    const whereOptions: FindOptionsWhere<UrlEntity> = {
      longUrl,
    };

    return this.getRepo(transactionManager).findOne({ where: whereOptions });
  }

  public async getUrls(queryDto: PaginationQueryDto) {
    return this.getRepo().findAndCount({
      where: {
        isInactive: false,
        deleted: false,
      },
      order: {
        visitCount: 'DESC',
        updatedAt: 'DESC',
      },
      skip: queryDto.offset,
      take: queryDto.limit,
    });
  }

  public async incrVisitCount(shortAlias: string) {
    return this.getRepo().increment({ alias: shortAlias }, 'visitCount', 1);
  }

  public async softDelete(id: string) {
    return this.getRepo().save({
      id,
      deleted: true,
    });
  }
}
