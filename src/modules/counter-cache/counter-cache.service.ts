import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

export class CounterCacheService {
  private redis: Redis;
  constructor(
    @Inject('IO_REDIS_OPTIONS')
    redisOptions: {
      url: string;
    },
  ) {
    this.redis = new Redis(redisOptions.url);
  }

  public async incr(key: string) {
    return this.redis.incr(key);
  }

  public async decr(key: string) {
    return this.redis.decr(key);
  }

  public async get(key: string) {
    return this.redis.get(key);
  }

  public async set(key: string, value: string, expirySeconds?: number) {
    if (!expirySeconds) {
      return this.redis.set(key, value);
    } else {
      return this.redis.setex(key, expirySeconds, value);
    }
  }
}
