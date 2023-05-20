import { Repository } from 'typeorm'
import { Injectable, Inject } from '@nestjs/common'

import { Meta } from './meta.entity'

@Injectable()
export class MetaService {
  constructor(
    @Inject('META_REPOSITORY')
    private metaRepository: Repository<Meta>,
  ) {}

  // add/update meta
  async updateMeta(type: string, content: string) {
    return this.metaRepository.save({ type, content })
  }

  // get meta
  async getMeta(type: string): Promise<Meta | null> {
    const meta = await this.metaRepository.findOne({
      where: { type },
    })
    return meta
  }

  // get all metas
  async getMetas(): Promise<Meta[]> {
    return await this.metaRepository.find()
  }
}
