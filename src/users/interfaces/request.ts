import { Request } from 'express'

import { UserDocument } from '../schemas/user.schema'

export interface FindParams {
  term?: string
  page: number
  limit: number
}

export interface IUserRequest extends FindParams, Request {
  user: UserDocument
}
