import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';

@Injectable()
export class UrlService {
  constructor(private readonly hashService: HashService) {}

  async shorten(longUrl: string): Promise<string> {
    return this.hashService.hash(longUrl);
  }
}
