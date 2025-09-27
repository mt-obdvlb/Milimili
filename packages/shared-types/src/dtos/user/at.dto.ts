import { z } from 'zod/v4'

export const userAtDTO = z.object({
  keyword: z.string().optional(),
  page: z.coerce.number().min(1).max(1000).default(1),
  pageSize: z.coerce.number().min(1).max(1000).default(20),
})

export type UserAtDTO = z.infer<typeof userAtDTO>
