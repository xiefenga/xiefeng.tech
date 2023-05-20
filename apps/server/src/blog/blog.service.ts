import { DataSource, Repository } from 'typeorm'
import { Injectable, Inject } from '@nestjs/common'

import { Blog } from './blog.entity'

@Injectable()
export class BlogService {
  constructor(
    @Inject('BLOG_REPOSITORY')
    private blogRepository: Repository<Blog>,
    @Inject('BLOG_DATASOURCE')
    private dataSource: DataSource,
  ) {}

  async getBlogList(): Promise<Omit<Blog, 'content'>[]> {
    return await this.blogRepository.find({
      select: ['title', 'post', 'update'],
      order: {
        post: 'DESC',
      },
    })
  }

  async updateBlog($blog: Pick<Blog, 'title' | 'content'> & Partial<Blog>) {
    const exist = await this.blogRepository.exist({
      where: {
        title: $blog.title,
      },
    })

    const current = new Date()

    const blog = exist
      ? { update: current, ...$blog }
      : $blog.post
      ? $blog.update && $blog.update >= $blog.post
        ? { ...$blog }
        : { ...$blog, update: $blog.post }
      : { post: current, update: current, ...$blog }

    await this.blogRepository.save(blog)
  }

  async getBlogDetail(title: string): Promise<Blog | null> {
    const list = await this.blogRepository.find({
      where: { title },
    })
    return list.length ? list[0] : null
  }
}
