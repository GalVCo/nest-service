import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();
    const rid = req.headers['x-request-id'];
    const method = req.method;
    const url = req.url;
    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(
            JSON.stringify({ rid, method, url, status: 200, ms: Date.now() - start }),
          ),
        error: (err) =>
          this.logger.error(
            JSON.stringify({
              rid,
              method,
              url,
              status: err?.status ?? 500,
              ms: Date.now() - start,
              msg: err?.message,
            }),
          ),
      }),
    );
  }
}

