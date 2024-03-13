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
