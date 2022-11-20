import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { database } from './config'
import { UsersModule } from './users/users.module'

@Module({
  imports: [MongooseModule.forRoot(database.host), UsersModule],
  controllers: [],
  providers: []
})
export class AppModule {}
