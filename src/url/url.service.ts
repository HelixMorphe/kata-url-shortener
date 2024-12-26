import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    private readonly hashService: HashService,
    private readonly configService: ConfigService,
  ) {}

  async shorten(longUrl: string): Promise<string> {
    const port = this.configService.get('PORT');
    const host = this.configService.get('HOST');

    if (!port) {
      throw new Error('PORT is not defined');
    }

    if (!host) {
      throw new Error('HOST is not defined');
    }

    const hostUrl = `http://${host}:${port}/`;

    const hashCode = await this.hashService.hash(longUrl);

    return `${hostUrl}${hashCode}`;
  }
}
