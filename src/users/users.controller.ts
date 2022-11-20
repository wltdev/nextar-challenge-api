import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id)
  }
}
