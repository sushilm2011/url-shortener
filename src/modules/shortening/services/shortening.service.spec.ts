import { UrlEntity } from '@database/entities/url.entity';
import { ShorteningService } from './shortening.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlMapper } from '../mappers/url.mapper';
import { UrlRepository } from '../repository/url.repository';
import { NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
            getUrls: jest.fn(),
            incrVisitCount: jest.fn(),
          };
        } else if (token === CACHE_MANAGER) {
          return {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn()
          }
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

  describe('getUrl', () => {
    it('should retrieve the long URL for a valid alias', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      jest.spyOn(mockUrlRepository, 'getByAlias').mockResolvedValue(urlEntity);
      const responseUrlEntity = await shorteningService.getUrl('abc');
      expect(responseUrlEntity.longUrl).toBe('https://www.google.com');
    });

    it('should throw NotFoundException if alias is not found', async () => {
      jest.spyOn(mockUrlRepository, 'getByAlias').mockResolvedValue(null);
      await expect(shorteningService.getUrl('abc123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUrls', () => {
    it('should call getUrls of url repository', async () => {
      const queryDto = { offset: 0, limit: 10 };

      jest.spyOn(mockUrlRepository, 'getUrls').mockResolvedValueOnce([[], 0]);
      await shorteningService.getUrls(queryDto);

      expect(mockUrlRepository.getUrls).toHaveBeenCalled();
      expect(mockUrlRepository.getUrls).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('incrScore', () => {
    it('should call incrScore of url repository', async () => {
      const shortAlias = 'google';

      jest.spyOn(mockUrlRepository, 'incrVisitCount');

      await shorteningService.incrScore(shortAlias);

      expect(mockUrlRepository.incrVisitCount).toHaveBeenCalled();
      expect(mockUrlRepository.incrVisitCount).toHaveBeenCalledWith(shortAlias);
    });
  });
});
