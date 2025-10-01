import { z } from 'zod/v4'

export const commentDeleteDTO = z.object({
  id: z.string(),
})

export type CommentDeleteDTO = z.infer<typeof commentDeleteDTO>
