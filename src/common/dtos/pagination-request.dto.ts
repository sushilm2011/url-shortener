import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 0 })
  offset?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 25 })
  limit?: number;
}
