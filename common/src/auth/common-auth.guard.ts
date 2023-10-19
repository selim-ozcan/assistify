import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CommonAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    return this.client.send<boolean>(
      { cmd: 'authorize' },
      request.headers.authorization.split(' ')[1],
    );
  }
}
