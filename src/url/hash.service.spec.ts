import { Test } from '@nestjs/testing';
import { HashService } from './hash.service';
import { createHash, randomUUID } from 'crypto';

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    hashService = module.get<HashService>(HashService);
  });

  it('hashes the string and returns the result', async () => {
    const result = await hashService.hash('https://example.com');
    const result2 = await hashService.hash('https://google.com');

    expect(result).toBeDefined();
    expect(result2).toBeDefined();
    expect(result).not.toBe(result2);
  });
});
