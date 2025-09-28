import { z } from 'zod/v4'

export const unlikeDTO = z.object({
  feedId: z.string().optional(),
  commentId: z.string().optional(),
  videoId: z.string().optional(),
})

export type UnlikeDTO = z.infer<typeof unlikeDTO>
