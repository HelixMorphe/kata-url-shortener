import { ConflictException, Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../../schemas/url.schema';
import { Model } from 'mongoose';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private readonly hashService: HashService,
    private readonly configService: ConfigService,
  ) {}

  async shorten(longUrl: string): Promise<string> {
    const hashCode = await this.hashService.hash(longUrl);

    try {
      await this.urlModel.create({ longUrl, shortCode: hashCode });
    } catch (e) {
      const error = e as Error;
      if (error.message.includes('duplicate key error')) {
        throw new ConflictException('The Url already exists');
      }
      console.log(e);
    }

    return this.generateUrl(hashCode);
  }

  async getLongUrl(shortCode: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortCode });

    if (!url) {
      return null;
    }

    return url.longUrl;
  }

  private generateUrl(shortCode: string): string {
    const port = this.configService.get('PORT');
    const host = this.configService.get('HOST');

    if (!port) {
      throw new Error('PORT is not defined');
    }

    if (!host) {
      throw new Error('HOST is not defined');
    }

    return `http://${host}:${port}/${shortCode}`;
  }
}
