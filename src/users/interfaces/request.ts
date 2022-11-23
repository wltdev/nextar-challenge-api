import { IUser } from '@/auth/interfaces/user'
import { Request } from 'express'

export interface FindParams {
  term?: string
  page: number
  limit: number
}

export interface IQueryRequest extends FindParams, Request {
  user: IUser
}
