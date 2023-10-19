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
  async authorize(@Payload() authHeader: string) {
    let token;
    try {
      const jwt = authHeader.split(' ')[1];
      token = await this.authService.validateToken(jwt);
      if (token) return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
