import { z } from 'zod/v4'

export const feedCreateDTO = z.object({
  content: z.string().min(1).max(1000),
  title: z.string().max(20).optional(),
  imageUrls: z.array(z.string()).optional(),
})

export type FeedCreateDTO = z.infer<typeof feedCreateDTO>
