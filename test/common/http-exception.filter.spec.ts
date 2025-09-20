import { ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../../src/common/filters/http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  const reply = jest.fn();
  const getResponse = jest.fn(() => ({}));
  const httpAdapter = { reply } as unknown as HttpAdapterHost['httpAdapter'];
  const host = {
    switchToHttp: () => ({ getResponse }),
  } as unknown as ArgumentsHost;

  beforeEach(() => jest.clearAllMocks());

  it('formats HttpException response', () => {
    const filter = new AllExceptionsFilter({ httpAdapter } as unknown as HttpAdapterHost);
    const err = new HttpException('oops', HttpStatus.BAD_REQUEST);
    filter.catch(err, host);
    expect(reply).toHaveBeenCalledWith({}, { message: 'oops' }, 400);
  });

  it('maps Prisma P2002 to 409', () => {
    const filter = new AllExceptionsFilter({ httpAdapter } as unknown as HttpAdapterHost);
    filter.catch({ code: 'P2002' }, host);
    expect(reply).toHaveBeenCalledWith({}, { message: 'Resource already exists' }, 409);
  });
});
