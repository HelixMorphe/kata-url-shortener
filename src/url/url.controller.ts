import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
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

  @Get(':shortCode')
  @Redirect()
  async getUrl(
    @Param('shortCode') shortCode: string,
  ): Promise<{ url: string; statusCode: number }> {
    const longUrl = await this.urlService.getLongUrl(shortCode);
    if (!longUrl) {
      throw new NotFoundException('URL not found');
    }

    return { url: longUrl, statusCode: 302 };
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
