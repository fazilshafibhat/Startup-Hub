import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, CurrentUser, UserRole, RolesGuard, UserDocument, Roles } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiTags('Auth')
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiTags('Auth')
  @Post('verify')
  async verifyEmail(@Body() verifyUserDto: VerifyUserDto) {
    return this.usersService.verifyEmail(verifyUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('Auth')
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

  @ApiTags('Auth')
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiTags('Auth')
  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }


  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getUser(@CurrentUser() user: UserDocument) {
    return { "user profile": user };
  }
}