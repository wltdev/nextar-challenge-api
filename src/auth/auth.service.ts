import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { UserDocument } from '@/users/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UsersService } from '../users/users.service'
import { CreateUserDto } from './../users/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, userPassword: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email)

    if (user) {
      const isValidPassword = await user.isValidPassword(userPassword)
      return isValidPassword && user
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
      access_token: this.jwtService.sign({ username: doc.email, sub: doc._id }),
      user: doc
    }
  }

  async getUser(id: string): Promise<UserDocument> {
    const user = await this.usersService.findOne(id)
    return user
  }

  async update(id: string, payload: UpdateUserDto): Promise<UserDocument> {
    return this.usersService.update(id, payload)
  }
}
