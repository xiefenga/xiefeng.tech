import { z } from 'zod'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { MetaSchema } from './meta.schema'
import { MetaService } from './meta.service'

@Controller('/meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Post('/update')
  async updateMeta(@Body() meta: z.infer<typeof MetaSchema>) {
    meta = MetaSchema.parse(meta)
    await this.metaService.updateMeta(meta.type, meta.content)
    return { code: 200, message: 'success' }
  }

  @Get('/detail/:type')
  async getMeta(@Param('type') type: string) {
    const meta = await this.metaService.getMeta(type)
    return { code: 200, message: 'success', data: meta }
  }

  @Get('/list')
  async getMetas() {
    const metas = await this.metaService.getMetas()
    return { code: 200, message: 'success', data: metas }
  }
}
