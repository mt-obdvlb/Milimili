import { z } from 'zod/v4'

export const feedListLikeTranspontDTO = z.object({
  page: z.coerce.number().min(1, { message: '页码不能小于 1' }).default(1),
  pageSize: z.coerce
    .number()
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(20),
})

export type FeedListLikeTranspontDTO = z.infer<typeof feedListLikeTranspontDTO>
