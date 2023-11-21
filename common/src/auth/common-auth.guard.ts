import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Observable, map, tap } from 'rxjs';
import { AUTH_SERVICE } from 'src/constants/services';

@Injectable()
export class CommonAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly client: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) return false;

    return this.client.send('authenticate', { Authentication: jwt }).pipe(
      tap((user) => (context.switchToHttp().getRequest().user = user)),
      map(() => true),
    );
  }
}
