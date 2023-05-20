import { z } from 'zod'

export const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  post: z.onumber(),
  update: z.onumber(),
})
