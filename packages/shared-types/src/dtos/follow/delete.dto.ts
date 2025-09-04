import { z } from 'zod/v4'

export const followDeleteDTO = z.object({
  followingId: z.string(),
})

export type FollowDeleteDTO = z.infer<typeof followDeleteDTO>
