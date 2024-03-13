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

// Write schema as @ApiProperty has some issue wrt to circular dependency issue: Track on github
export const ShortenRequestSchema = {
  type: 'object',
  required: ['longUrl'],
  properties: {
    longUrl: {
      type: 'string',
      description: 'The long URL to be shortened.',
    },
  },
};

export const RenameRequestSchema = {
  type: 'object',
  required: ['alias', 'customAlias'],
  properties: {
    alias: {
      type: 'string',
      description: 'The alias to be renamed.',
    },
    customAlias: {
      type: 'string',
      description: 'The customAlias to be used.',
    },
  },
};
