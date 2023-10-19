import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { AUTH_SERVICE } from 'src/constants/services';

@Injectable()
export class CommonAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.headers.authorization) return false;

    return this.client
      .send<boolean>(
        'authenticate',
        request.headers.authorization.split(' ')[1],
      )
      .pipe(tap((user) => (context.switchToHttp().getRequest().user = user)));
  }
}
