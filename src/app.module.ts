import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersModule } from './users/users.module'

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://usermongodbtest:Fu4pxEQ3F9TtUINo@cluster0.nlt84jp.mongodb.net/test'
    ),
    UsersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
