import { Test } from '@nestjs/testing';
import { UrlService } from './url.service';
import { HashService } from './hash.service';

describe('UrlService', () => {
  let service: UrlService;
  let hashService: HashService = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HashService,
          useValue: hashService,
        },
        UrlService,
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('returns a hashed string', async () => {
    (hashService.hash as jest.Mock).mockResolvedValue('hashedString');
    const longUrl = 'https://example.com';

    const result = await service.shorten(longUrl);

    expect(result).toBe('hashedString');
  });
});
