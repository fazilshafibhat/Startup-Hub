import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { UsersService } from './users/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly userService: UsersService
  ) { }

  async login(user: UserDocument, response: Response) {
    try {
      const tokenPayload: TokenPayload = {
        userId: user._id.toHexString(),
        role: user.role
      };

      const expires = new Date();
      expires.setSeconds(
        expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'),
      );

      const token = this.jwtService.sign(tokenPayload);

      response.cookie('Authentication', token, {
        httpOnly: true,
        expires,
        // path: '/',
      });

      return token;
    } catch (error) {
      this.logger.error(`Token creation failed for user: ${user.email}`, error.stack);
      throw new Error('Token creation failed');
    }

  }

  async googleLogin(req): Promise<string> {
    if (!req.user) {
      return 'No user from Google';
    }
    let user = await this.userService.findByEmail(req.user.email);
    return this.login(req.user, req.res);
  }
}