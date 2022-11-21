import { Controller, Post, Request, UseGuards } from '@nestjs/common'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() request: any) {
    return this.authService.login(request.user)
  }
}
