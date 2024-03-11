import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ShortenRequestDto {
  @ApiProperty()
  @IsUrl()
  longUrl: string;
}
