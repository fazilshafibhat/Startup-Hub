import { Module } from '@nestjs/common';
import { DatabaseModule, UserDocument, UserSchema, NOTIFICATIONS_SERVICE, ResetToken, ResetTokenSchema } from '@app/common';
import { UsersController } from './users.controller';
import { UsersService } from './user.service';
import { UsersRepository } from './user.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResetTokenRepository } from './reset_token.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      {name: ResetToken.name, schema: ResetTokenSchema}
    ]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('NOTIFICATIONS_HOST'),
            port: configService.get('NOTIFICATIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, ResetTokenRepository, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
