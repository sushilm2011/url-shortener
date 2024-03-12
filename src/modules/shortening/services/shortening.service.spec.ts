import { UrlEntity } from '@database/entities/url.entity';
import { ShorteningService } from './shortening.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlMapper } from '../mappers/url.mapper';
import { UrlRepository } from '../repository/url.repository';
import { NotFoundException, RequestTimeoutException } from '@nestjs/common';

const mockShorteningStrategy = {
  encode: jest.fn(),
};

describe('ShorteningService', () => {
  let shorteningService: ShorteningService;
  let mockUrlRepository: UrlRepository;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        ShorteningService,
        { provide: 'SHORTENING_STRATEGY', useValue: mockShorteningStrategy },
        { provide: 'SHORTENING_ATTEMPTS', useValue: 10 },
        UrlMapper,
      ],
    })
      .useMocker((token) => {
        if (token === UrlRepository) {
          return {
            getByAlias: jest.fn(),
            saveUrl: jest.fn(),
          };
        }
      })
      .compile();

    shorteningService = testModule.get<ShorteningService>(ShorteningService);
    mockUrlRepository = testModule.get<UrlRepository>(UrlRepository);
  });

  describe('shortenUrl', () => {
    it('should shorten a valid URL', async () => {
      const longUrl = 'https://www.google.com';
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = longUrl;
      urlEntity.alias = 'abc123';

      jest.spyOn(mockShorteningStrategy, 'encode').mockReturnValue('abc123');
      jest.spyOn(mockUrlRepository, 'saveUrl').mockResolvedValueOnce(urlEntity);

      const result = await shorteningService.shortenUrl({ longUrl });

      expect(mockShorteningStrategy.encode).toHaveBeenCalledWith(longUrl);
      expect(mockUrlRepository.getByAlias).toHaveBeenCalledWith('abc123');
      expect(mockUrlRepository.saveUrl).toHaveBeenCalledWith({
        longUrl,
        alias: 'abc123',
      });
      expect(result).toEqual({ longUrl, alias: 'abc123' });
    });

    it('should throw RequestTimeoutException if alias generation fails', async () => {
      const longUrl = 'https://www.google.com';
      const existingUrlEntity = new UrlEntity();
      existingUrlEntity.longUrl = 'https://www.random.com';
      existingUrlEntity.alias = 'abc123';

      const urlEntity = new UrlEntity();
      urlEntity.longUrl = longUrl;
      urlEntity.alias = 'abc123';

      jest.spyOn(mockShorteningStrategy, 'encode').mockReturnValue('abc123');
      jest
        .spyOn(mockUrlRepository, 'getByAlias')
        .mockResolvedValue(existingUrlEntity);
      jest.spyOn(mockUrlRepository, 'saveUrl').mockResolvedValue(urlEntity);

      await expect(shorteningService.shortenUrl({ longUrl })).rejects.toThrow(
        RequestTimeoutException,
      );
    });
  });

  describe('getLongUrl', () => {
    it('should retrieve the long URL for a valid alias', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      jest.spyOn(mockUrlRepository, 'getByAlias').mockResolvedValue(urlEntity);
      const longUrl = await shorteningService.getLongUrl('abc');
      expect(longUrl).toBe('https://www.google.com');
    });

    it('should throw NotFoundException if alias is not found', async () => {
      jest.spyOn(mockUrlRepository, 'getByAlias').mockResolvedValue(null);
      await expect(shorteningService.getLongUrl('abc123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});