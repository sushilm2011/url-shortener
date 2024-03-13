import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'url' })
export class UrlEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'long_url' })
  longUrl: string;

  @Index()
  @Column({ name: 'alias', unique: true })
  alias: string;

  @Column({ name: 'visit_count', default: 0 })
  visitCount: number;

  @Column({ name: 'is_inactive', default: false })
  isInactive: boolean;

  @Column({ name: 'deleted', default: false })
  deleted: boolean;

  @Column({ name: 'request_limit', nullable: true })
  requestLimit: number;
}
