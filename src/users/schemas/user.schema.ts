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

  @Prop({ required: true, minlength: 6 })
  password: string

  @Prop({ default: 'standard' })
  permission: string

  @Prop({ required: true })
  phone: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
  const hashed = await hash(this.password, 10)
  this.password = hashed

  next()
})

// UserSchema.path('password').validate(function (payload) {
//   return payload.length < 6
// }, 'Path `password` is shorter than the minimum allowed length (6)')

UserSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery(), '+password')
  const payload = this.getUpdate()['$set']

  if (payload.password && payload.password !== docToUpdate.password) {
    const hashed = await hash(payload.password, 10)
    this.getUpdate()['$set'].password = hashed
  }

  next()
})

UserSchema.methods.isValidPassword = function (candidatePassword: string) {
  return compare(candidatePassword, this.password)
}
