import { Request, Response } from 'express';
import { RequestIdMiddleware } from '../../src/common/middleware/request-id.middleware';

describe('RequestIdMiddleware', () => {
  it('sets x-request-id header when missing', () => {
    const req = { headers: {} } as unknown as Request;
    const headers: Record<string, string> = {};
    const res = {
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
    } as unknown as Response;
    const next = jest.fn();

    new RequestIdMiddleware().use(req, res, next);

    expect(req.headers['x-request-id']).toBeDefined();
    expect(headers['x-request-id']).toBe(req.headers['x-request-id']);
    expect(next).toHaveBeenCalled();
  });

  it('preserves incoming x-request-id header', () => {
    const req = { headers: { 'x-request-id': 'abc' } } as unknown as Request;
    const headers: Record<string, string> = {};
    const res = { setHeader: (k: string, v: string) => (headers[k] = v) } as unknown as Response;
    const next = jest.fn();

    new RequestIdMiddleware().use(req, res, next);

    expect(req.headers['x-request-id']).toBe('abc');
    expect(headers['x-request-id']).toBe('abc');
  });
});

