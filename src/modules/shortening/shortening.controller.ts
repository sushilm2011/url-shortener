import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RenameRequestDto, ShortenRequestDto } from './dtos/shorten-request.dto';
import { ShorteningService } from './services/shortening.service';

@ApiTags('Shortener')
@Controller('shorten')
export class ShorteningController {
  constructor(private shorteningService: ShorteningService) {}

  @Post()
  public async shortenUrl(@Body() shortenReqDto: ShortenRequestDto) {
    return this.shorteningService.shortenUrl(shortenReqDto);
  }

  @Patch()
  public async updateUrl(@Body() renameReqDto: RenameRequestDto) {
    return this.shorteningService.renameUrl(renameReqDto);
  }
}
