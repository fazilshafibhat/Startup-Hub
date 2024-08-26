import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  Inject,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './user.repository';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { VerifyUserDto } from './dto/verify-user.dto';
import { nanoid } from 'nanoid';
import { ResetTokenRepository } from './reset_token.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository,
    private readonly resetTokenRepository: ResetTokenRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const verificationCode = Math.floor(Math.random() * 100000 + 1);
    createUserDto.verificationCode = `${verificationCode}`;
    await this.validateCreateUserDto(createUserDto);
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    this.notificationsService.emit('notify_email', {
      email: 'fazil.bgsbu2016@gmail.com',
      html: `<p>🌟 Greetings from Startup Hub! 🌟</p>
         <p>Welcome to Startup Hub! We're excited to have you join us on this journey. Your OTP is: ${verificationCode}. 🚀</p>`,
    });

    return newUser;
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async verifyEmail(verifyUserDto: VerifyUserDto) {
    const { email, otp } = verifyUserDto;
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (user.verificationCode !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    return this.usersRepository.findOneAndUpdate(
      { _id: user._id },
      { $set: { verified: true, verificationCode: null } },
    );
  }


  // async sendOtp(email: string) {
  //   const user = await this.usersRepository.findOne({ email });
  //   if (!user) {
  //     throw new BadRequestException('User not found.');
  //   }

  //   const otp = Math.floor(Math.random() * 100000 + 1);
  //   await this.usersRepository.findOneAndUpdate(
  //     { _id: user._id },
  //     { $set: { verificationCode: otp } },
  //   );

  //   this.notificationsService.emit('notify_email', {
  //     email: 'fazil.bgsbu2016@gmail.com',
  //     text: `Your OTP for password reset is: ${otp}.`,
  //   });
  //   return { message: 'OTP sent' }
  // }

  // async verifyOtpAndResetPassword(email: string, otp: string, newPassword: string) {
  //   const user = await this.usersRepository.findOne({ email });
  //   if (!user) {
  //     throw new BadRequestException('User not found.');
  //   }

  //   if (user.verificationCode !== otp) {
  //     throw new BadRequestException('Invalid OTP.');
  //   }

  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   return this.usersRepository.findOneAndUpdate(
  //     { _id: user._id },
  //     { $set: { password: hashedPassword, verificationCode: null } },
  //   );
  // }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found...');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: newHashedPassword } },
    );

    if (!updatedUser) {
      throw new BadRequestException('Failed to update password');
    }

    return updatedUser;
  }

  async forgotPassword(email: string) {
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      await this.resetTokenRepository.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });
      const resetLink = `http://yourapp.com/reset-password?token=${resetToken}`;
      this.notificationsService.emit('notify_email', {
        email: 'fazil.bgsbu2016@gmail.com',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,

      });
    }

    return { message: 'If this user exists, they will receive an email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.resetTokenRepository.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    const user = await this.usersRepository.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return { message: 'Password reset successfully' };;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }
}