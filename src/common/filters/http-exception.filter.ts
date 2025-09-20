import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: any = { message: 'Internal Server Error' };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      body = typeof resp === 'string' ? { message: resp } : resp;
    } else if (exception?.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      body = { message: 'Resource already exists' };
    }

    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}

