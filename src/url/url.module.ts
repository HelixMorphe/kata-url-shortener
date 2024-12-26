import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { HashService } from './hash.service';
import { Url, UrlSchema } from '../../schemas/url.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlController],
  providers: [UrlService, HashService],
})
export class UrlModule {}
