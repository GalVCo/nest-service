import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { createAppWithDefaults } from './utils/app';

describe('Logging (e2e)', () => {
  let app: INestApplication;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({ $queryRawUnsafe: jest.fn().mockResolvedValue(1) })
      .compile();

    app = await createAppWithDefaults(moduleRef);
  });

  beforeEach(() => {
    logSpy = jest.spyOn(Logger.prototype as any, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(Logger.prototype as any, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('logs a successful request without throwing', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(logSpy).toHaveBeenCalled();
  });

  it('logs an erroring request without throwing', async () => {
    const res = await request(app.getHttpServer()).get('/v1/books/does-not-exist');
    expect([404, 500]).toContain(res.status);
    expect(errorSpy).toHaveBeenCalled();
  });
});
