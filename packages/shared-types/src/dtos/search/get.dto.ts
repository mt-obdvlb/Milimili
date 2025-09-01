import { z } from 'zod/v4'

export type SearchType = 'all' | 'video' | 'user'
export type SearchSort = 'all' | 'publishedAt' | 'view' | 'danmaku' | 'favorite'
export type SearchTime = 'all' | '10' | '10to30' | '30to60' | '60'
export type SearchPublishedAt = 'all' | 'today' | 'week' | 'halfYear' | 'customer'

export const searchGetDTO = z.object({
  kw: z.string().min(1).max(20),
  page: z.coerce.number().min(1).max(1000).default(1),
  type: z.enum(['all', 'video', 'user']).default('all') as z.ZodType<SearchType>,
  sort: z
    .enum(['all', 'publishedAt', 'view', 'danmaku', 'favorite'])
    .default('all') as z.ZodType<SearchSort>,
  time: z.enum(['all', '10', '10to30', '30to60', '60']).default('all') as z.ZodType<SearchTime>,
  publishedAt: z
    .enum(['all', 'today', 'week', 'halfYear', 'customer'])
    .default('all') as z.ZodType<SearchPublishedAt>,
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

export type SearchGetDTO = z.infer<typeof searchGetDTO>
