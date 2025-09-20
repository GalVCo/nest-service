import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from '../../src/common/interceptors/logging.interceptor';

export async function createAppWithDefaults(moduleRef: TestingModule): Promise<INestApplication> {
  const app = moduleRef.createNestApplication();
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.init();
  return app;
}

