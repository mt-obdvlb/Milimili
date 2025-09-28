import { z } from 'zod/v4'

export const likeDTO = z.object({
  feedId: z.string().optional(),
  commentId: z.string().optional(),
  videoId: z.string().optional(),
})

export type LikeDTO = z.infer<typeof likeDTO>
