import { UserDocument } from '@/users/schemas/user.schema'

export interface IUserToken {
  access_token: string
  user: UserDocument
}

export interface IUserPayload {
  sub: string
  email: string
  name: string
  username: string
  permission: string
}
