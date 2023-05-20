import { DataSource } from 'typeorm'
import { Meta } from './meta.entity'

export const metaProviders = [
  {
    provide: 'META_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Meta),
    inject: ['DATA_SOURCE'],
  },
]
