import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const passwordIsValid = await bcrypt.compare(pass, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('Password is not valid');
    if (user) {
      return { email: user.email, userId: user._id, role: user.role };
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = { email: user.email, userId: user.userId, role: user.role };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(payload);
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token);
  }
}
