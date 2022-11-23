import { CreateUserDto } from '@/users/dto/create-user.dto'
import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common'

import { UpdateUserDto } from './../users/dto/update-user.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/public-route.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() request: any) {
    return await this.authService.login(request.user)
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.create(body)
  }

  @Get('profile')
  async profile(@Request() request: any) {
    return request.user
  }

  @Put('profile')
  async updateProfile(@Body() body: UpdateUserDto, @Request() request: any) {
    return await this.authService.update(request.user._id, body)
  }
}
