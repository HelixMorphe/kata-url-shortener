import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';

@Injectable()
export class HashService {
  constructor() {}

  async hash(longUrl: string): Promise<string> {
    return createHash('sha256').update(longUrl).digest('hex').slice(0, 6);
  }
}
