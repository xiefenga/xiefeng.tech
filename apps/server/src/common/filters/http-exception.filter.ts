import { ZodError } from 'zod'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(ZodError)
export class ZodErrorFilter implements ExceptionFilter<ZodError> {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const errorResponse = {
      code: 400,
      message: '参数错误',
      errors: exception.issues
        .map((issue) => `${issue.path.join('.')} ${issue.message}`)
        .join(','),
    }

    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
