import { UserDocument } from '@/users/schemas/user.schema'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { AuthService } from '../auth.service'
import { jwtConstants } from '../constants'
import { IUserPayload } from '../interfaces/user'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: IUserPayload): Promise<UserDocument> {
    const user = await this.authService.getUser(payload.sub)
    return user
  }
}
