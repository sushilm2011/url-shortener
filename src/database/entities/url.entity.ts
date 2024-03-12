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

  @Column({ name: 'custom_alias', nullable: true, unique: true })
  customAlias: string;
}
