import { User } from '@/users/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'

import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, userPassword: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email)

    if (user) {
      const matchPassword = await compare(userPassword, user.password)
      delete user.password
      return matchPassword && user
    }

    return null
  }
}
