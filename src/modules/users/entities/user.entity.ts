// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true }) // <-- otomatis bikin createdAt & updatedAt
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string; // akan di-exclude sebelum dikirim ke client
}

export type UserDocument = HydratedDocument<User>; // _id & timestamps sudah ada
export const UserSchema = SchemaFactory.createForClass(User);
