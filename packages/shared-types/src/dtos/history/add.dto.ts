import { z } from 'zod/v4'

export const historyAddDTO = z.object({
  userId: z.string().optional(),
  videoId: z.string(),
  duration: z.number(),
})

export type HistoryAddDTO = z.infer<typeof historyAddDTO>
