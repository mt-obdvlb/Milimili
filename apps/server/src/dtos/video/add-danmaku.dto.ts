import { z } from 'zod/v4'

export const videoAddDanmakuDTO = z.object({
  userId: z.string(),
  videoId: z.string(),
  content: z.string(),
  position: z.enum(['top', 'bottom', 'scroll']),
  time: z.number(),
  color: z.string().default('#FFFFFF'),
})

export type VideoAddDanmakuDTO = z.infer<typeof videoAddDanmakuDTO>
