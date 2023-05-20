import { Module } from '@nestjs/common'
import { BlogService } from './blog.service'
import { blogProviders } from './blog.providers'
import { BlogController } from './blog.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  controllers: [BlogController],
  imports: [DatabaseModule],
  providers: [...blogProviders, BlogService],
})
export class BlogModule {}
