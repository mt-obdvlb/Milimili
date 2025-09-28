import { z } from 'zod/v4'

export const feedListDTO = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(20),
})

export type FeedListDTO = z.infer<typeof feedListDTO>
