import { z } from 'zod'

export const MetaSchema = z.object({
  type: z.string(),
  content: z.string(),
})
