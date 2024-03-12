import { InterceptorOptions } from '@common/interfaces';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private config: InterceptorOptions;

  constructor(config: InterceptorOptions) {
    this.config = config;
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();

      if (this.config.exclude && request.originalUrl.match(this.config.exclude)) {
        return next.handle().pipe(map((data) => data));
      }

      return next.handle().pipe(
        map((data) => {
          let message = null;
          let statusCode = null;
          let success = true;
          if (data?.message) {
            message = data.message;
            delete data.message;
          }
          if (data?.statusCode) {
            statusCode = data.statusCode;
            delete data.statusCode;
          }
          if (data?.success) {
            success = data.success;
            delete data.success;
          }
          statusCode = statusCode || response.statusCode;
          response.status(statusCode);
          return {
            success: success,
            message: message || response.statusMessage || 'OK',
            data: data || {},
          };
        }),
      );
    } else {
      return next.handle().pipe(map((data) => data));
    }
  }
}
