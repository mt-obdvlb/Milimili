import { z } from 'zod/v4'

export const feedListLikeTranspontDTO = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(20),
})

export type FeedListLikeTranspontDTO = z.infer<typeof feedListLikeTranspontDTO>
