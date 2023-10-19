import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDto } from 'src/interfaces/user.dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user as UserDto;
  },
);
