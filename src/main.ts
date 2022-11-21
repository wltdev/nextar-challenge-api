import 'dotenv/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './HttpExceptions/http-exceptions.filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())

  const port = process.env.PORT || 3333
  await app.listen(port)

  Logger.log(`Server is running on port ${port}`, 'Bootstrap')
}

bootstrap()
