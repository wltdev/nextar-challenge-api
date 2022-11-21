import { Module } from '@nestjs/common'
import { APP_GUARD, APP_FILTER } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { database } from './config'
import { HttpExceptionFilter } from './exceptions/http-exceptions.filters'
import { MongoErrorFilter } from './exceptions/mongodb-exception.filter'
import { RolesGuard } from './users/roles/roles.guard'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    MongooseModule.forRoot(database.host, {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-unique-validator'))
        return connection
      }
    }),
    UsersModule,
    AuthModule
  ],
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
