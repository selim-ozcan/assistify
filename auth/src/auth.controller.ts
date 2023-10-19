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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  MessagePattern,
  PatternMetadata,
  Payload,
} from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user) {
    return await this.authService.login(user);
  }

  @MessagePattern({ cmd: 'authorize' })
  async authorize(@Payload() token: string) {
    try {
      const payload = await this.authService.validateToken(token);
      if (payload) return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
