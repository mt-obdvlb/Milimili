import { z } from 'zod/v4'

export const commentDTO = z.object({
  feedId: z.string().optional(),
  commentId: z.string().optional(),
  videoId: z.string().optional(),
  content: z.string().min(1).max(1000),
})

export type CommentDTO = z.infer<typeof commentDTO>
