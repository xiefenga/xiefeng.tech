import { Module } from '@nestjs/common'

import { MetaService } from './meta.service'
import { metaProviders } from './meta.providers'
import { MetaController } from './meta.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  controllers: [MetaController],
  imports: [DatabaseModule],
  providers: [...metaProviders, MetaService],
})
export class MetaModule {}
