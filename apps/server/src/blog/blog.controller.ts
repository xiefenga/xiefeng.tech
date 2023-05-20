import { z } from 'zod'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { BlogSchema } from './blog.schema'
import { BlogService } from './blog.service'
import { BlogListItemDto } from './blog.dto'

@Controller('/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/update')
  async updateBlog(@Body() blog: z.infer<typeof BlogSchema>) {
    blog = BlogSchema.parse(blog)
    const { title, content } = blog

    const params: Parameters<typeof this.blogService.updateBlog>[0] = {
      title,
      content,
    }

    if (blog.post) {
      params.post = new Date(blog.post)
    }

    if (blog.update) {
      params.update = new Date(blog.update)
    }

    await this.blogService.updateBlog(params)
    return { code: 200, message: 'success', data: null }
  }

  @Get('/list')
  async getBlogList() {
    const list = await this.blogService.getBlogList()
    const data: BlogListItemDto[] = list.map((item) => ({
      ...item,
      post: item.post.getTime(),
      update: item.update.getTime(),
    }))
    return { code: 200, message: 'success', data }
  }

  @Get('/detail/:title')
  async getBlogDetail(@Param('title') title: string) {
    const detail = await this.blogService.getBlogDetail(title)
    return { code: 200, message: 'success', data: detail }
  }
}
