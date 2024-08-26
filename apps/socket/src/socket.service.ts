import { Injectable } from '@nestjs/common';
import { Messages } from './schema/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
// import { User } from 'apps/auth/src/schema/User.schema';
import { UserDocument } from '@app/common';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Messages.name) private messageModel: Model<Messages>,
    // @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async saveMessage(createMessageDto: CreateMessageDto): Promise<string> {
    await this.messageModel.create(createMessageDto);
    return 'Message saved';
  }

  async updateSocketIdOfUser(userAndSocketIdDto: {
    userId: string;
    socketId: string;
  }) {
    await this.userModel.findByIdAndUpdate(userAndSocketIdDto.userId, {
      socketId: userAndSocketIdDto.socketId,
    });
    return 'User socketId is updated';
  }

  // async findUserById(id: any) {
  //   const user = await this.userModel.findById(id);
  //   return user.socketId;
  // }
}
