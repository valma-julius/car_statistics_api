import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

// Wraping SerializeInterceptor in a custom decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before the request is handled by request handler
    // console.log('I am running before handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // console.log('I am running before the response is sent out', data);

        return plainToClass(this.dto, data, {
          // Exclude what is not visible in DTO
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
