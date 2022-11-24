import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { hash, compare } from 'bcrypt'

export interface UserDocument extends User {
  _id: string
  isValidPassword?: (password: string) => Promise<boolean>
}

export interface UserQuery {
  $or: [
    {
      name: RegExp
    },
    {
      email: RegExp
    }
  ]
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true, select: false, minlength: 6 })
  password: string

  @Prop({ default: 'standard' })
  permission: string

  @Prop({ required: true })
  phone: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
  this.password = await hash(this.password, 10)

  next()
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  const payload = this.getUpdate()['$set']

  if (payload.password && payload.password.length >= 6) {
    payload.password = await hash(payload.password, 10)
  }

  next()
})

UserSchema.methods.isValidPassword = function (candidatePassword: string) {
  return compare(candidatePassword, this.password)
}
