import { UserDocument } from '@/users/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'

import { UsersService } from '../users/users.service'
import { CreateUserDto } from './../users/dto/create-user.dto'
import { IUser } from './interfaces/User'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, userPassword: string): Promise<IUser | null> {
    const user = await this.usersService.findByEmail(email)

    if (user) {
      const matchPassword = await compare(userPassword, user.password)
      return matchPassword && user
    }

    return null
  }

  async login(user: UserDocument): Promise<any> {
    const payload = { username: user.name, sub: user._id }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        permission: user.permission,
        phone: user.phone
      }
    }
  }

  async create(user: CreateUserDto): Promise<any> {
    const doc: UserDocument = await this.usersService.create(user)

    return {
      access_token: this.jwtService.sign({ username: doc.name, sub: doc._id }),
      user: doc
    }
  }
}
