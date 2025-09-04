import { z } from 'zod/v4'

export const followGetDTO = z.object({
  followingId: z.string(),
})

export type FollowGetDTO = z.infer<typeof followGetDTO>
