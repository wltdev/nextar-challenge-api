import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { database } from '../config'
import { DatabaseService } from './database.service'

@Module({
  imports: [
    MongooseModule.forRoot(database.host, {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-unique-validator'))
        return connection
      }
    })
  ],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
