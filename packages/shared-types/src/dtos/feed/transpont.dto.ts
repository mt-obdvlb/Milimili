import { z } from 'zod/v4'

export const feedTranspontDTO = z.object({
  content: z.string().min(0).optional(),
  feedId: z.string(),
})

export type FeedTranspontDTO = z.infer<typeof feedTranspontDTO>
