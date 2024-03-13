import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { StatisticsMapper } from '../mappers/statistics.mapper';
import { ShorteningService } from '@modules/shortening/services/shortening.service';
import { StatisticsRepository } from '../repository/statistics.repository';
import { LinkAccessEventDto } from '@common/dtos/link-access-event.dto';
import { PaginationQueryDto } from '@common/dtos/pagination-request.dto';
import { IUrlSummary } from '../interfaces/url-summary.interface';

describe('StatisticsService', () => {
  let statisticsService: StatisticsService;
  let statisticsRepo: StatisticsRepository;
  let shorteningService: ShorteningService;
  let statisticsMapper: StatisticsMapper;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [StatisticsService, StatisticsMapper],
    })
      .useMocker((token) => {
        if (token === ShorteningService) {
          return {
            getUrls: jest.fn(),
            incrScore: jest.fn(),
          };
        } else if (token === StatisticsRepository) {
          return {
            saveEvent: jest.fn(),
            getUrlSummary: jest.fn(),
          };
        }
      })
      .compile();

    statisticsService = testModule.get<StatisticsService>(StatisticsService);
    statisticsRepo = testModule.get<StatisticsRepository>(StatisticsRepository);
    shorteningService = testModule.get<ShorteningService>(ShorteningService);
    statisticsMapper = testModule.get<StatisticsMapper>(StatisticsMapper);
  });

  it('to be defined', () => {
    expect(statisticsService).toBeDefined();
    expect(statisticsRepo).toBeDefined();
  });

  describe('saveLinkAccessStats', () => {
    const eventData: LinkAccessEventDto = {
      longUrl: 'https://www.google.com',
      shortAlias: 'google',
      reqHeaders: { host: 'http://localhost' },
      timestamp: new Date().valueOf(),
    };

    it('should save event successfully', async () => {
      jest.spyOn(statisticsRepo, 'saveEvent').mockImplementation();

      await statisticsService.saveLinkAccessStats(eventData);

      expect(statisticsRepo.saveEvent).toHaveBeenCalled();
      expect(statisticsRepo.saveEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          longUrl: eventData.longUrl,
          alias: eventData.shortAlias,
          accessTimestamp: new Date(eventData.timestamp),
          host: eventData.reqHeaders.host,
        }),
      );
    });

    it('should save ip correctly if present in request', async () => {
      const eventDataTest: LinkAccessEventDto = {
        ...eventData,
        reqHeaders: { host: 'http://localhost', ip: '127.0.0.1' },
      };
      jest.spyOn(statisticsRepo, 'saveEvent').mockImplementation();

      await statisticsService.saveLinkAccessStats(eventDataTest);

      expect(statisticsRepo.saveEvent).toHaveBeenCalled();
      expect(statisticsRepo.saveEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          longUrl: eventDataTest.longUrl,
          alias: eventDataTest.shortAlias,
          accessTimestamp: new Date(eventDataTest.timestamp),
          host: eventDataTest.reqHeaders.host,
          ip: eventDataTest.reqHeaders.ip,
        }),
      );
    });

    it('should increment score successfully', async () => {
      jest.spyOn(shorteningService, 'incrScore').mockImplementation();

      await statisticsService.saveLinkAccessStats(eventData);

      expect(shorteningService.incrScore).toHaveBeenCalled();
      expect(shorteningService.incrScore).toHaveBeenCalledWith(
        eventData.shortAlias,
      );
    });
  });

  describe('getUrlSummary', () => {
    let queryDto: PaginationQueryDto;
    let urls = [];
    const longUrls = [];
    const urlSummary: IUrlSummary[] = [];

    beforeAll(() => {
      queryDto = { offset: 0, limit: 10 };
      urls = [];
      for (let i = 0; i < 10; i++) {
        urls.push({
          alias: `alia${i}`,
          longUrl: `https://www.alia${i}.com`,
          id: `${i}`,
          score: Math.floor(Math.random() * 100),
        });
        longUrls.push(`https://www.alia${i}.com`);
        urlSummary.push({
          shortAlias: `alia${i}`,
          longUrl: `https://www.alia${i}.com`,
          clicks: i + 1,
          recentAccess: new Date(),
        });
      }
    });

    it('successfully gets result from shortening service', async () => {
      jest
        .spyOn(shorteningService, 'getUrls')
        .mockResolvedValueOnce([urls, 20]);
      jest.spyOn(statisticsRepo, 'getUrlSummary').mockImplementation();
      jest.spyOn(statisticsMapper, 'toSummaryDto').mockImplementation();

      await statisticsService.getUrlSummary(queryDto);

      expect(shorteningService.getUrls).toHaveBeenCalled();
      expect(shorteningService.getUrls).toHaveBeenCalledWith(queryDto);
      expect(statisticsRepo.getUrlSummary).toHaveBeenCalled();
      expect(statisticsRepo.getUrlSummary).toHaveBeenCalledWith(longUrls);
    });

    it('successfully gets result from statisticsRepo', async () => {
      jest
        .spyOn(shorteningService, 'getUrls')
        .mockResolvedValueOnce([urls, 20]);
      jest
        .spyOn(statisticsRepo, 'getUrlSummary')
        .mockResolvedValueOnce(urlSummary);
      jest.spyOn(statisticsMapper, 'toSummaryDto').mockImplementation();

      await statisticsService.getUrlSummary(queryDto);

      expect(statisticsRepo.getUrlSummary).toHaveBeenCalled();
      expect(statisticsRepo.getUrlSummary).toHaveBeenCalledWith(longUrls);
      expect(statisticsMapper.toSummaryDto).toHaveBeenCalled();
      expect(statisticsMapper.toSummaryDto).toHaveBeenCalledWith(
        urls,
        urlSummary,
      );
    });

    it('successfully returns paginated result', async () => {
      jest
        .spyOn(shorteningService, 'getUrls')
        .mockResolvedValueOnce([urls, 20]);
      jest
        .spyOn(statisticsRepo, 'getUrlSummary')
        .mockResolvedValueOnce(urlSummary);

      const results = await statisticsService.getUrlSummary(queryDto);

      expect(results.total).toBe(20);
      expect(results.offset).toBe(queryDto.offset);
      expect(results.limit).toBe(queryDto.limit);
    });
  });
});
