import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { database } from './config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(database.host), UsersModule, AuthModule],
  controllers: [],
  providers: []
})
export class AppModule {}
