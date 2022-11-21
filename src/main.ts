import 'dotenv/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './exceptions/http-exceptions.filters'
import { MongoErrorFilter } from './exceptions/mongodb-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalFilters(new MongoErrorFilter())

  const port = process.env.PORT || 3333
  await app.listen(port)

  Logger.log(`Server is running on port ${port}`, 'Bootstrap')
}

bootstrap()
