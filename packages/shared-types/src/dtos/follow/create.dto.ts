import { z } from 'zod/v4'

export const followCreateDTO = z.object({
  followingId: z.string(),
})

export type FollowCreateDTO = z.infer<typeof followCreateDTO>
