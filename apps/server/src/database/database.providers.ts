import { DataSource } from 'typeorm'
import databaseConfig from '../config/database.config'

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        ...databaseConfig,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      })

      return dataSource.initialize()
    },
  },
]
