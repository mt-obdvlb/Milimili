import { z } from 'zod/v4'

export type VideoGetWatchLaterType = 'all' | 'not_watched'
export type VideoGetWatchLaterSort = 'latest' | 'first'
export type VideoGetWatchLaterTime = 'all' | '10' | '10to30' | '30to60' | '60'
export type VideoGetWatchLaterAddAt = 'all' | 'today' | 'yesterday' | 'week' | 'customer'

export const videoGetWatchLaterDTO = z.object({
  kw: z.string().min(1).max(20).optional(),
  sort: z.enum(['latest', 'first']).default('latest') as z.ZodType<VideoGetWatchLaterSort>,
  type: z.enum(['all', 'not_watched']).default('all') as z.ZodType<VideoGetWatchLaterType>,
  time: z
    .enum(['all', '10', '10to30', '30to60', '60'])
    .default('all') as z.ZodType<VideoGetWatchLaterTime>,
  addAt: z
    .enum(['all', 'today', 'yesterday', 'week', 'customer'])
    .default('all') as z.ZodType<VideoGetWatchLaterAddAt>,
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

export type VideoGetWatchLaterDTO = z.infer<typeof videoGetWatchLaterDTO>
