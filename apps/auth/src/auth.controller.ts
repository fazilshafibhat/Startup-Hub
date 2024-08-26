import { Controller, HttpStatus, Post, Res, UseGuards, Logger, Get, Request } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { CurrentUser, UserDocument } from '@app/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @ApiTags('Auth')
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const jwt = await this.authService.login(user, response);
      this.logger.debug(`JWT generated for user: ${user.email}`);
      response.send({ token: jwt });
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Login failed' });
    }
  }
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) { }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const token = await this.authService.googleLogin(req);
    res.redirect(`FRONTEND_URL/auth/callback?token=${token}`);
  }
}