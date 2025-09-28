import { z } from 'zod/v4'

export const commentGetDTO = z.object({
  feedId: z.string().optional(),
  commentId: z.string().optional(),
  videoId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(1000).default(20),
  sort: z.enum(['new', 'hot']).default('hot'),
})

export type CommentGetDTO = z.infer<typeof commentGetDTO>
