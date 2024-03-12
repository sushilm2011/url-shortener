import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ShortenRequestDto {
  @IsUrl()
  longUrl: string;
}
