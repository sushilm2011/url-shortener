import { Test, TestingModule } from '@nestjs/testing';
import { RedirectionService } from './redirection.service';
import { Queue } from 'bull';
import { ShorteningService } from '@modules/shortening/services/shortening.service';
import { getQueueToken } from '@nestjs/bull';
import {
  LINK_ACCESS_EVENTS_QUEUE,
  LINK_ACCESS_EVENT_TYPE,
} from '@common/constants/queue.constants';
import { Logger } from '@nestjs/common';
import { CounterCacheService } from '@modules/counter-cache/counter-cache.service';

describe('RedirectionService', () => {
  let redirectionService: RedirectionService;
  let shorteningService: ShorteningService;
  let linkAccessEventQueue: Queue;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [RedirectionService],
    })
      .useMocker((token) => {
        if (token === ShorteningService) {
          return {
            getUrl: jest.fn(),
          };
        } else if (token === getQueueToken(LINK_ACCESS_EVENTS_QUEUE)) {
          return {
            add: jest.fn(),
          };
        } else if (token === CounterCacheService) {
          return {
            get: jest.fn(),
            incr: jest.fn(),
            set: jest.fn(),
          };
        }
      })
      .compile();

    redirectionService = testModule.get<RedirectionService>(RedirectionService);
    shorteningService = testModule.get<ShorteningService>(ShorteningService);
    linkAccessEventQueue = testModule.get<Queue>(
      getQueueToken(LINK_ACCESS_EVENTS_QUEUE),
    );
  });

  it('to be defined', () => {
    expect(redirectionService).toBeDefined();
    expect(shorteningService).toBeDefined();
    expect(linkAccessEventQueue).toBeDefined();
  });

  describe('getLongUrl', () => {
    afterEach(() => {
      jest.spyOn(linkAccessEventQueue, 'add').mockRestore();
      jest.spyOn(shorteningService, 'getUrl').mockRestore();
    });

    it('should return longUrl successfully', async () => {
      const headers = { host: 'localhost' };
      const expectedLongUrl = 'https://www.google.com';
      jest
        .spyOn(shorteningService, 'getUrl')
        .mockResolvedValueOnce({ longUrl: expectedLongUrl } as any);
      jest.spyOn(linkAccessEventQueue, 'add').mockResolvedValueOnce({} as any);

      const longUrl = await redirectionService.getLongUrl('google123', {
        headers,
      } as any);
      expect(longUrl).toBe(expectedLongUrl);
    });

    it('should add event to bull queue successfully', async () => {
      const headers = { host: 'localhost' };
      const expectedLongUrl = 'https://www.google.com';

      jest
        .spyOn(shorteningService, 'getUrl')
        .mockResolvedValueOnce({ longUrl: expectedLongUrl } as any);
      jest.spyOn(linkAccessEventQueue, 'add').mockResolvedValueOnce({} as any);

      const longUrl = await redirectionService.getLongUrl('google123', {
        headers,
      } as any);
      expect(longUrl).toBe(expectedLongUrl);
      expect(linkAccessEventQueue.add).toHaveBeenCalled();
      expect(linkAccessEventQueue.add).toHaveBeenCalledWith(
        LINK_ACCESS_EVENT_TYPE,
        expect.any(Object),
        expect.objectContaining({ removeOnComplete: true, timeout: 10000 }),
      );
    });

    it('should gracefully log error on add rejection', async () => {
      const headers = { host: 'localhost' };
      const expectedLongUrl = 'https://www.google.com';
      const error = new Error('Queue error');

      jest
        .spyOn(shorteningService, 'getUrl')
        .mockResolvedValueOnce({ longUrl: expectedLongUrl } as any);
      jest.spyOn(linkAccessEventQueue, 'add').mockRejectedValue(error);
      const errorLoggerSpy = jest.spyOn(Logger, 'error').mockImplementation();

      await redirectionService.getLongUrl('google123', { headers } as any);

      expect(errorLoggerSpy).toHaveBeenCalled();
      expect(errorLoggerSpy).toHaveBeenCalledWith(
        'Error while publishing event to linkAccessEventQueue Error: Queue error',
        'publishAccessEvent:google123',
      );
      errorLoggerSpy.mockRestore();
    });
  });
});
