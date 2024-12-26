import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { BadRequestException } from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService = {
    shorten: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UrlService,
          useValue: urlService,
        },
      ],
      controllers: [UrlController],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('shorten', () => {
    it('returns BAD request if no longUrl is provided', async () => {
      expect(async () => {
        await controller.shorten({
          longUrl: undefined,
        });
      }).rejects.toThrow(BadRequestException);
    });

    it('returns BAD request if invalid URL is provided', async () => {
      const invalidUrl = 'invalid-url';

      expect(async () => {
        await controller.shorten({
          longUrl: invalidUrl,
        });
      }).rejects.toThrow(BadRequestException);
    });

    it('returns a shortened URL', async () => {
      (urlService.shorten as jest.Mock).mockResolvedValue('shortURL');
      const longUrl = 'https://example.com';

      const result = await controller.shorten({ longUrl });

      expect(result).toBe('shortURL');
    });
  });
});
