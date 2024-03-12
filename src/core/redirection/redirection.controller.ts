import { ShorteningService } from '@core/shortening/services/shortening.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RedirectionController {
  constructor(private shorteningService: ShorteningService) {}

  @Get('/:alias')
  public async redirectToLongUrl(
    @Param('alias') shortAlias: string,
    @Res() res: Response,
  ) {
    const longUrl = await this.shorteningService.getLongUrl(shortAlias);
    return res.redirect(longUrl);
  }
}
