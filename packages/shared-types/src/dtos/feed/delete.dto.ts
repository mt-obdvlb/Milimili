import { z } from 'zod/v4'

export const feedDeleteDTO = z.object({
  id: z.string(),
})

export type FeedDeleteDTO = z.infer<typeof feedDeleteDTO>
