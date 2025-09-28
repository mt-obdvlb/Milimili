import { z } from 'zod/v4'

export const likeGetDTO = z.object({
  feedId: z.string().optional(),
  commentId: z.string().optional(),
  videoId: z.string().optional(),
})

export type LikeGetDTO = z.infer<typeof likeGetDTO>
