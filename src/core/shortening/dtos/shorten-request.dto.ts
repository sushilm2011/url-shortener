import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ShortenRequestDto {
  @ApiProperty({ example: 'https://www.google.com' })
  @IsUrl()
  longUrl: string;
}
