import { z } from 'zod/v4'

export const followListDTO = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  userId: z.string(),
  type: z.enum(['following', 'follower']).default('following'),
})

export type FollowListDTO = z.infer<typeof followListDTO>
