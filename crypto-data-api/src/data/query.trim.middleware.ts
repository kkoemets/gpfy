import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class QueryTrimMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        req.query = Object.fromEntries(Object.entries(req.query).map(([key, value]) => [key, value.toString().trim()]));
        next();
    }
}
