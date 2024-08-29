import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessageSchema } from './schema/message.schema';
// import { User, UserSchema } from 'apps/auth/src/schema/User.schema';
import { UserSchema, UserDocument } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessageSchema },
      // { name: User.name, schema: UserSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [SocketController],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
