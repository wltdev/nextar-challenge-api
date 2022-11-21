import * as mongoose from 'mongoose'

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId
  name: string
  email: string
  permission?: string
  phone?: string
}

export interface IUserPayload {
  sub: string
  email: string
  name: string
  username: string
  permission: string
}
