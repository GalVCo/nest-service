import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerName = 'x-request-id';
    const incoming = req.headers[headerName];
    const rid = (Array.isArray(incoming) ? incoming[0] : incoming) || uuidv4();
    req.headers[headerName] = rid;
    res.setHeader(headerName, rid);
    next();
  }
}
