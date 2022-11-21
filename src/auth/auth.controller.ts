import { CreateUserDto } from '@/users/dto/create-user.dto'
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'

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
    return this.authService.login(request.user)
  }

  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.create(body)
  }
}
