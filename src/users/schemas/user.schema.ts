import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { hash, compare } from 'bcrypt'
import mongoose from 'mongoose'

export interface UserDocument extends User {
  _id: mongoose.Schema.Types.ObjectId
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true, select: true })
  password: string

  @Prop()
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

UserSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery(), '+password')
  const payload = this.getUpdate()['$set']

  if (payload.password !== docToUpdate.password) {
    const hashed = await hash(payload.password, 10)
    this.getUpdate()['$set'].password = hashed
  }

  next()
})

UserSchema.methods.isValidPassword = function (candidatePassword: string) {
  compare(candidatePassword, this.password, function (err, isMatch) {
    return isMatch
  })
}
