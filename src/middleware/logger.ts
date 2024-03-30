import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'];

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      this.logger.log(
        `${method} ${originalUrl} - ${statusCode} ${statusMessage} - ${ip} - ${userAgent}`,
      );
    });

    next();
  }
}
