import { ShorteningService } from 'src/modules/shortening/services/shortening.service';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { RedirectionService } from './redirection.service';

@Controller()
export class RedirectionController {
  constructor(private redirectionService: RedirectionService) {}

  @Get('/:alias')
  public async redirectToLongUrl(
    @Param('alias') shortAlias: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    req.headers
    const longUrl = await this.redirectionService.getLongUrl(shortAlias);
    return res.redirect(longUrl);
  }
}
