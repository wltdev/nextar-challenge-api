import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { hash } from 'bcrypt'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  permision: string

  @Prop({ required: true })
  phone: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
  const hashed = await hash(this.password, 10)
  this.password = hashed
  next()
})
