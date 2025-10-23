import { z } from 'zod/v4'

export const videoShareDTO = z.object({
  videoId: z.string().min(1),
  content: z.string().optional(),
})

export type VideoShareDTO = z.infer<typeof videoShareDTO>
