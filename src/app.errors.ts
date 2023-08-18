import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as _ from 'lodash';
import {
  ValidationError,
  NotFoundError,
  CheckViolationError,
  DataError,
} from 'objection';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let httpStatus;
    let responseBody;

    if (exception instanceof ValidationError) {
      switch (exception.type) {
        case 'ModelValidation':
          responseBody = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
            type: 'ModelValidationError',
            data: exception.data,
            modelClass: exception.modelClass,
            timestamp: new Date().toISOString(),
            path: request.url,
          };

          httpStatus = HttpStatus.BAD_REQUEST;
          break;
        default:
          responseBody = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
            type: 'UnknownValidationError',
            data: {},
            modelClass: exception.modelClass,
            timestamp: new Date().toISOString(),
            path: request.url,
          };

          httpStatus = HttpStatus.BAD_REQUEST;
          break;
      }
    } else if (exception instanceof NotFoundError) {
      responseBody = {
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
        type: 'NotFoundError',
        data: {},
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      httpStatus = HttpStatus.NOT_FOUND;
    } else if (exception instanceof CheckViolationError) {
      responseBody = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        type: 'CheckViolation',
        data: {
          table: exception.table,
          constraint: exception.constraint,
        },
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof DataError) {
      responseBody = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        type: 'InvalidData',
        data: {},
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      httpStatus = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      const errorResponse: ExceptionResponse | any = exception.getResponse();

      responseBody = {
        statusCode: exception.getStatus(),
        message: _.isArray(errorResponse.message)
          ? errorResponse.message[0]
          : errorResponse.message,
        type: 'HttpException',
        data: {},
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      httpStatus = exception.getStatus();
    } else {
      responseBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        type: 'UnknownError',
        data: {},
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(httpStatus).json(responseBody);
  }
}

export interface ExceptionResponse {
  statusCode: number;
  message: string | string[] | object;
  error: string;
}
