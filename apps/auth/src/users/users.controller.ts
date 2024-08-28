import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, CurrentUser, UserRole, RolesGuard, UserDocument } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { Roles } from '@app/common';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('verify')
  async verifyEmail(@Body() verifyUserDto: VerifyUserDto) {
    return this.usersService.verifyEmail(verifyUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ) {
    return this.usersService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }


  @Roles(UserRole.Freelancer)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getUser(@CurrentUser() user: UserDocument) {
    return { "user profile": user };
  }
}