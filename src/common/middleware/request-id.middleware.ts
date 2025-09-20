import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const headerName = 'x-request-id';
    const rid = req.headers[headerName] || uuidv4();
    req.headers[headerName] = rid;
    res.setHeader(headerName, rid);
    next();
  }
}

