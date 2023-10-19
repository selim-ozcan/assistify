import {
  Controller,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from '@soassistify/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user) {
    return await this.authService.login(user);
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() token: string) {
    try {
      const payload = await this.authService.validateToken(token);
      if (payload) return { userId: payload.userId, email: payload.email };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
