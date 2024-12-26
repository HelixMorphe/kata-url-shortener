import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService = {
    shorten: jest.fn(),
    getLongUrl: jest.fn(),
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

  describe('getUrl', () => {
    it('redirects to the long URL', async () => {
      const longUrl = 'https://example.com';
      const shortCode = 'shortCode';

      (urlService.getLongUrl as jest.Mock).mockResolvedValue(longUrl);

      const response = await controller.getUrl(shortCode);

      expect(response).toEqual({
        url: longUrl,
        statusCode: 302,
      });
    });

    it('returns 404 if the long URL is not found', async () => {
      (urlService.getLongUrl as jest.Mock).mockResolvedValue(null);
      const shortCode = 'shortCode';

      expect(async () => {
        await controller.getUrl(shortCode);
      }).rejects.toThrow(NotFoundException);
    });
  });
});
