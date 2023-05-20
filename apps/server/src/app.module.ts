import { Module } from '@nestjs/common'

import { MetaModule } from './meta/meta.module'
import { BlogModule } from './blog/blog.module'
import { AppController } from './app.controller'

@Module({
  imports: [BlogModule, MetaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
