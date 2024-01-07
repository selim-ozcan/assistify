import {
  Controller,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Get,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from '@soassistify/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user, @Res({ passthrough: true }) response) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() token: any) {
    try {
      const payload = await this.authService.validateToken(
        token.Authentication,
      );
      if (payload)
        return {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };
    } catch (error) {
      return false;
    }
  }
}
