import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseEntity } from './response/exceptionResponse.filter';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // You can access the exception message and status like this
    const status = exception.getStatus();

    // Customize your response format here

    response
      .status(status)
      .json(
        ResponseEntity.ERROR_WITH_ONLY_TWO(
          exception.message,
          String(exception.getStatus()),
        ),
      );
    // response.status(status).json({
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   message: exception.message,
    // });
  }
}
