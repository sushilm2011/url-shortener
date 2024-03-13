import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();

      const request_id = uuidv4().split('-').join('');
      request.headers['x-request-id'] = request_id;
      request.headers['ip'] = request.ip;

      response.set('x-request-id', request_id);

      return next.handle().pipe(
        tap((data) => {
          const requestDetails = {
            method: request.method,
            headers: request.headers,
            query_params: request.query,
            body: request.body,
            requested_endpoint: request.originalUrl,
            response_body: data,
            status: response.statusCode,
          };

          if (requestDetails.requested_endpoint !== '/health') {
            Logger.log(
              JSON.stringify(requestDetails),
              'RequestLoggingInterceptor',
            );
          }
        }),
      );
    } else {
      return next.handle();
    }
  }
}
