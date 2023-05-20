import * as dotenv from 'dotenv'
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions'

dotenv.config()

const config: MysqlConnectionCredentialsOptions = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
}

export default config
