import { z } from 'zod/v4'

export type HistoryGetTime = 'all' | '10' | '10to30' | '30to60' | '60'
export type HistoryGetWatchAt = 'all' | 'today' | 'yesterday' | 'week' | 'customer'

export const historyGetDTO = z.object({
  kw: z.string().optional(),
  time: z.enum(['all', '10', '10to30', '30to60', '60']).default('all') as z.ZodType<HistoryGetTime>,
  watchAt: z
    .enum(['all', 'today', 'yesterday', 'week', 'customer'])
    .default('all') as z.ZodType<HistoryGetWatchAt>,
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number(),
  pageSize: z.coerce.number().default(20),
})

export type HistoryGetDTO = z.infer<typeof historyGetDTO>
