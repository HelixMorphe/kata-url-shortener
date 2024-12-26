import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async shorten(@Body() body: { longUrl: string }): Promise<string> {
    const longUrl = body.longUrl;

    if (!longUrl) {
      throw new BadRequestException('No longUrl provided');
    }

    if (!this.isValidUrl(longUrl)) {
      throw new BadRequestException('Invalid URL provided');
    }

    return this.urlService.shorten(longUrl);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
}
