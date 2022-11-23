import { Controller, Get, Post, Body, Param, Delete, Put, Req } from '@nestjs/common'
import { Request } from 'express'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from './roles/roles.decorators'
import { Role } from './roles/roles.enum'
import { FindParams } from './schemas/user.schema'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Get()
  async findAll(@Req() request: Request) {
    const { term, page, limit } = request.query as unknown as FindParams
    return await this.usersService.findAll({ term, page, limit })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id)
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body)
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id)
  }
}
