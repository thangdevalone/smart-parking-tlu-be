import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => throwError(() => this.errorHandler(err, context)))
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    return response.status(status).json({
      success: false,
      status: status,
      path: request.url,
      message: exception.message,
      type: exception.name
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();


    const statusCode = res?.status || HttpStatus.OK;

    if (response.status) response.status(statusCode);


    if (res?.paginate) {
      return {
        path: request?.url,
        message: res?.message || '',
        status: statusCode,
        data: res?.paginate,
        pagination: {
          page: res.page,
          totalPages: res.totalPages,
          totalItems: res.totalItems,
          hasNext: res.hasNext
        }
      };
    }

    return {
      path: request?.url,
      message: res?.message || '',
      status: statusCode,
      data: res?.data || res
    };
  }
}
