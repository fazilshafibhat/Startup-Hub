import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

export enum UserRole {
  JOBSEEKER = 'jobseeker',
  COMPANY = 'company',
  FREELANCER = 'freelancer',
}

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

  @Prop()
  roles?: string[];
  // @Prop({ type: [String], enum: UserRole, default: [UserRole.JOBSEEKER] })
  // roles: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
