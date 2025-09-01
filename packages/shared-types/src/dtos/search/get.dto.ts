import { z } from 'zod/v4'

export const searchGetDTO = z.object({
  kw: z.string().min(1).max(20),
  page: z.number().min(1).max(1000).default(1),
  type: z.enum(['all', 'video', 'user']).default('all'),
  sort: z.enum(['all', 'publishedAt', 'view', 'like']).default('all'),
  time: z.enum(['all', '10', '10to30', '30to60', '60']).default('all'),
  publishedAt: z.enum(['all', 'today', 'week', 'halfYear', 'customer']).default('all'),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
})

export type SearchGetDTO = z.infer<typeof searchGetDTO>
