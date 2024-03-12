import { IsOptional, IsString } from 'class-validator';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    update: false,
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @IsOptional()
  @IsString()
  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @IsOptional()
  @IsString()
  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;
}
