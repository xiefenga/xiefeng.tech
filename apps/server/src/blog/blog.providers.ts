import { DataSource } from 'typeorm'
import { Blog } from './blog.entity'

export const blogProviders = [
  {
    provide: 'BLOG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Blog),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BLOG_DATASOURCE',
    useFactory: (dataSource: DataSource) => dataSource,
    inject: ['DATA_SOURCE'],
  },
]
