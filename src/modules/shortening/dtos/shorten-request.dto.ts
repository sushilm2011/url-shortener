import { IsString, IsUrl, MinLength } from 'class-validator';

export class ShortenRequestDto {
  @IsUrl()
  longUrl: string;
}

export class RenameRequestDto {
  @IsString()
  alias: string;

  @IsString()
  @MinLength(5, { message: 'Should have atleast 5 characters' })
  customAlias: string;
}
