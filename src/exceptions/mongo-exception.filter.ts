import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common'
import { Error } from 'mongoose'
import ValidationError = Error.ValidationError

@Catch(ValidationError)
export class MongoErrorFilter implements RpcExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    return response.status(400).json({
      statusCode: 400,
      message: exception.message,
      errors: exception.errors
    })
  }
}
