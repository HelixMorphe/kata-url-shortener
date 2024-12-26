import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { HashService } from './hash.service';

@Module({
  controllers: [UrlController],
  providers: [UrlService, HashService],
})
export class UrlModule {}
