import { Test, TestingModule } from '@nestjs/testing';
import { UrlRepository } from './url.repository';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UrlEntity } from '@database/entities/url.entity';
import { ormConfig } from '@config/orm.config';

describe('UrlRepository', () => {
  let urlRepo: UrlRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...ormConfig,
          database: process.env.TYPEORM_TEST_DATABASE as any,
          synchronize: true,
          logging: false,
          entities: [UrlEntity],
        }),
        TypeOrmModule.forFeature([UrlEntity]),
      ],
      providers: [UrlRepository],
    }).compile();
    urlRepo = module.get<UrlRepository>(UrlRepository);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await module.get(getRepositoryToken(UrlEntity)).clear();
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await module.close();
  });

  it('to be defined', () => {
    expect(urlRepo).toBeDefined();
    expect(module).toBeDefined();
  });

  describe('saveUrl', () => {
    it('Saves and returns an url entity successfully', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      const savedUrl = await urlRepo.saveUrl(urlEntity);
      expect(savedUrl).toBeDefined();
      expect(savedUrl.id).toBeDefined();
    });

    it('Saves the assigned alias url successfully', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      const savedUrl = await urlRepo.saveUrl(urlEntity);
      expect(savedUrl.longUrl).toBe(urlEntity.longUrl);
      expect(savedUrl.alias).toBe(urlEntity.alias);
    });
  });

  describe('getById', () => {
    it('Finds the given id successfully', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      const savedUrl = await urlRepo.saveUrl(urlEntity);
      const foundUrl = await urlRepo.getById(savedUrl.id);

      expect(foundUrl.id).toBe(savedUrl.id);
      expect(foundUrl.longUrl).toBe(urlEntity.longUrl);
      expect(foundUrl.alias).toBe(urlEntity.alias);
    });
  });

  describe('getByAlias', () => {
    it('Finds the given alias urls successfully', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      const savedUrl = await urlRepo.saveUrl(urlEntity);
      const foundUrl = await urlRepo.getByAlias(urlEntity.alias);

      expect(foundUrl.id).toBe(savedUrl.id);
      expect(foundUrl.longUrl).toBe(urlEntity.longUrl);
      expect(foundUrl.alias).toBe(urlEntity.alias);
    });
  });

  describe('getByLongUrl', () => {
    it('Finds the given long url successfully', async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      const savedUrl = await urlRepo.saveUrl(urlEntity);
      const foundUrl = await urlRepo.getByLongUrl(urlEntity.longUrl);

      expect(foundUrl.id).toBe(savedUrl.id);
      expect(foundUrl.longUrl).toBe(urlEntity.longUrl);
      expect(foundUrl.alias).toBe(urlEntity.alias);
    });
  });

  describe('getUrls', () => {
    beforeEach(async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      await urlRepo.saveUrl(urlEntity);

      const urlEntity2 = new UrlEntity();
      urlEntity2.longUrl = 'https://www.google.com';
      urlEntity2.alias = 'google2';
      await urlRepo.saveUrl(urlEntity2);
    });

    it('should return only values as per limit passed', async () => {
      const queryDto = { offset: 0, limit: 1 };
      const [urls, total] = await urlRepo.getUrls(queryDto);

      expect(urls.length).toBe(1);
      expect(total).toBe(2);
    });

    it('should skip values as per offset passed', async () => {
      const queryDto = { offset: 1, limit: 1 };
      const [urls, total] = await urlRepo.getUrls(queryDto);

      expect(urls.length).toBe(1);
      expect(total).toBe(2);
    });

    it('should not return any values if offset exceeds results', async () => {
      const queryDto = { offset: 2, limit: 1 };
      const [urls, total] = await urlRepo.getUrls(queryDto);

      expect(urls.length).toBe(0);
      expect(total).toBe(2);
    });
  });

  describe('incrVisitCount', () => {
    beforeEach(async () => {
      const urlEntity = new UrlEntity();
      urlEntity.longUrl = 'https://www.google.com';
      urlEntity.alias = 'google';
      await urlRepo.saveUrl(urlEntity);
    });

    it('default visitCount should be 0', async () => {
      const url = await urlRepo.getByAlias('google');
      expect(url.visitCount).toBe(0);
    });

    it('should increment visitCount successfully', async () => {
      await urlRepo.incrVisitCount('google');
      const url = await urlRepo.getByAlias('google');
      expect(url.visitCount).toBe(1);
    });
  });
});
