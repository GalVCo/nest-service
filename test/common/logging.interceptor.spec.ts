import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from '../../src/common/interceptors/logging.interceptor';
import { of, throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

describe('LoggingInterceptor', () => {
  const makeCtx = (rid = 'rid-1') => ({
    switchToHttp: () => ({
      getRequest: () => ({ headers: { 'x-request-id': rid }, method: 'GET', url: '/foo' }),
    }),
  }) as any;

  const makeNext = (obs: 'ok' | 'error') => ({
    handle: () => (obs === 'ok' ? of({ hello: 'world' }) : throwError(() => new HttpException('bad', 400))),
  });

  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(Logger.prototype as any, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(Logger.prototype as any, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs successful responses', (done) => {
    const interceptor = new LoggingInterceptor();
    interceptor.intercept(makeCtx(), makeNext('ok')).subscribe({
      next: () => {
        expect(logSpy).toHaveBeenCalledTimes(1);
        const arg = (logSpy.mock.calls[0][0] as string) || '';
        const parsed = JSON.parse(arg);
        expect(parsed).toMatchObject({ rid: 'rid-1', method: 'GET', url: '/foo', status: 200 });
        expect(typeof parsed.ms).toBe('number');
        done();
      },
    });
  });

  it('logs errors with status code', (done) => {
    const interceptor = new LoggingInterceptor();
    interceptor.intercept(makeCtx('rid-2'), makeNext('error')).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalledTimes(1);
        const arg = (errorSpy.mock.calls[0][0] as string) || '';
        const parsed = JSON.parse(arg);
        expect(parsed).toMatchObject({ rid: 'rid-2', method: 'GET', url: '/foo', status: 400, msg: 'bad' });
        expect(typeof parsed.ms).toBe('number');
        done();
      },
    });
  });
});

