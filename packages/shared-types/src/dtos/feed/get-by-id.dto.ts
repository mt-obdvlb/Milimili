import { z } from 'zod/v4'

export const feedGetByIdDTO = z.object({
  id: z.string(),
})

export type FeedGetByIdDTO = z.infer<typeof feedGetByIdDTO>
