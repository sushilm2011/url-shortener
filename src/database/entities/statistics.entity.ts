import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'link_access_event' })
export class LinkAccessEventEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'long_url' })
  longUrl: string;

  @Column({ name: 'alias' })
  alias: string;

  @Column({ name: 'access_timestamp', type: 'timestamp' })
  accessTimestamp: Date;

  @Column({ name: 'request_id' })
  requestId: string;

  @Column({ name: 'host', nullable: true })
  host: string;

  @Column({ name: 'referrer', nullable: true })
  referrer: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'language', nullable: true })
  language: string;

  @Column({ name: 'platform', nullable: true })
  platform: string;

  @Column({ name: 'ip', nullable: true })
  ip: string;
}
