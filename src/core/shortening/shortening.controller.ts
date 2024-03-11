import { Body, Controller, Post } from '@nestjs/common';
import { ShortenRequestDto } from './dtos/shorten-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { ShorteningService } from './shortening.service';

@ApiTags('Shortener')
@Controller('shorten')
export class ShorteningController {
  constructor(private shorteningService: ShorteningService) {}

  @Post()
  public async shortenUrl(@Body() shortenReqDto: ShortenRequestDto) {
    return this.shorteningService.shortenUrl(shortenReqDto);
  }
}
