import { z } from 'zod/v4'

export const feedListDTO = z.object({
  userId: z.string(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
})

export type FeedListDTO = z.infer<typeof feedListDTO>
