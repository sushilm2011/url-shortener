import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  RenameRequestDto,
  RenameRequestSchema,
  ShortenRequestDto,
  ShortenRequestSchema,
} from './dtos/shorten-request.dto';
import { ShorteningService } from './services/shortening.service';

@ApiTags('Shortener')
@Controller('shorten')
export class ShorteningController {
  constructor(private shorteningService: ShorteningService) {}

  @Post()
  @ApiBody({
    schema: ShortenRequestSchema,
  })
  public async shortenUrl(@Body() shortenReqDto: ShortenRequestDto) {
    return this.shorteningService.shortenUrl(shortenReqDto);
  }

  @Patch()
  @ApiBody({
    schema: RenameRequestSchema,
  })
  public async updateUrl(@Body() renameReqDto: RenameRequestDto) {
    return this.shorteningService.renameUrl(renameReqDto);
  }

  @Delete(':/alias')
  @ApiParam({ name: 'alias', example: 'z5FgTb' })
  public async deleteAlias(@Param('alias') alias: string) {
    return this.shorteningService.delete(alias);
  }
}
