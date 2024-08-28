import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  verificationCode?: string;

  @Prop({ default: 'freelancer', enum: ['admin', 'companies', 'freelancer', 'jobSeeker'] })
  role?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
