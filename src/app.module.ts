import { Module } from '@nestjs/common'
import { APP_GUARD, APP_FILTER } from '@nestjs/core'

import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { DatabaseModule } from './database/database.module'
import { HttpExceptionFilter } from './exceptions/http-exceptions.filters'
import { MongoErrorFilter } from './exceptions/mongo-exception.filter'
import { RolesGuard } from './users/roles/roles.guard'
import { UsersModule } from './users/users.module'

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: MongoErrorFilter
    }
  ]
})
export class AppModule {}
