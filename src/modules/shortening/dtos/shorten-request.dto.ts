import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class ShortenRequestDto {
  @IsUrl()
  longUrl: string;

  @IsNumber()
  @IsOptional()
  requestLimit?: number;
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
  required: ['longUrl', 'requestLimit'],
  properties: {
    longUrl: {
      type: 'string',
      description: 'The long URL to be shortened.',
    },
    requestLimit: {
      type: 'number',
      description:
        'The request limit for the generated alias, as soon as the request limit is reached the url will stop working anymore.',
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
