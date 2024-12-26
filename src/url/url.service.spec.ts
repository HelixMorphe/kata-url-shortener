import { Test } from '@nestjs/testing';
import { UrlService } from './url.service';
import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Url } from '../../schemas/url.schema';

function mockConfigService() {
  return {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'PORT':
          return 3000;
        case 'HOST':
          return 'localhost';
      }
    }),
  } as any;
}

describe('UrlService', () => {
  let service: UrlService;
  let configService: ConfigService = mockConfigService();
  let hashService: HashService = {
    hash: jest.fn(),
  };

  let mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HashService,
          useValue: hashService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: getModelToken(Url.name),
          useValue: mockModel,
        },
        UrlService,
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  describe('shorten', () => {
    it('returns a hashed string', async () => {
      (hashService.hash as jest.Mock).mockResolvedValue('hashedString');
      const longUrl = 'https://example.com';

      const result = await service.shorten(longUrl);

      expect(result).toBe(`http://localhost:3000/hashedString`);
      expect(mockModel.create).toHaveBeenCalledWith({
        longUrl,
        shortCode: `hashedString`,
      });
    });

    it('returns 409 Conflict if the longUrl is already in the database', async () => {
      (hashService.hash as jest.Mock).mockResolvedValue('hashedString');
      (mockModel.create as jest.Mock).mockRejectedValue({
        message: 'duplicate key error',
      });
      const longUrl = 'https://example.com';

      expect(async () => {
        await service.shorten(longUrl);
      }).rejects.toThrow('The Url already exists');
    });
  });

  describe('getLongUrl', () => {
    it('returns longURL from database', async () => {
      const longUrl = 'https://example.com';
      const shortCode = 'shortCode';
      const mockUrl = {
        longUrl,
      };

      (mockModel.findOne as jest.Mock).mockResolvedValue(mockUrl);

      const result = await service.getLongUrl(shortCode);

      expect(result).toBe(longUrl);
      expect(mockModel.findOne).toHaveBeenCalledWith({ shortCode });
    });

    it('returns null if the longURL is not found', async () => {
      const shortCode = 'shortCode';
      (mockModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.getLongUrl(shortCode);

      expect(result).toBeNull();
      expect(mockModel.findOne).toHaveBeenCalledWith({
        shortCode,
      });
    });
  });
});
