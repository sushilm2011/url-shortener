import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { RedirectionService } from './services/redirection.service';

@Controller()
export class RedirectionController {
  constructor(private redirectionService: RedirectionService) {}

  @Get('/:alias')
  public async redirectToLongUrl(
    @Param('alias') shortAlias: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const longUrl = await this.redirectionService.getLongUrl(shortAlias, req);
    return res.redirect(longUrl);
  }
}
