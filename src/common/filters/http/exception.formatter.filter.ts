import { InterceptorOptions } from '@common/interfaces';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private config: InterceptorOptions;

  constructor(config: InterceptorOptions) {
    this.config = config;
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const excetionResponse = exception.getResponse();
    const errorDetails = exception.getResponse()['error']
      ? exception.getResponse()['error']
      : null;

    const requestDetails = {
      method: request.method,
      headers: request.headers,
      query_params: request.query,
      body: request.body,
      requested_endpoint: request.originalUrl,
      response_body: excetionResponse,
      status: status,
    };

    if (!this.config.exclude || !request.originalUrl.match(this.config.exclude)) {
      const data = {
        success: false,
        message: excetionResponse['message'],
        error: errorDetails,
      };

      requestDetails.response_body = data;
    }

    const logString = `${JSON.stringify(requestDetails)} \n ${[
      request.method,
      request.originalUrl,
      status,
    ].join(' ')}`;
    Logger.log(logString, 'HttpExceptionFilter');
    response.status(status).json(requestDetails.response_body);
  }
}
