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

  private getRepo(transactionManager: EntityManager) {
    return transactionManager
      ? transactionManager.getRepository(UrlEntity)
      : this.urlRepo;
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
    includeCustomAlias?: boolean,
    transactionManager?: EntityManager,
  ) {
    const whereOptions: FindOptionsWhere<UrlEntity> = {};

    if (includeCustomAlias) {
      whereOptions.customAlias = alias;
    } else {
      whereOptions.alias = alias;
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
}
