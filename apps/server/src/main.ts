import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ZodErrorFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new ZodErrorFilter())
  await app.listen(1461)
}
bootstrap()
