import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: null })
  emailToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
