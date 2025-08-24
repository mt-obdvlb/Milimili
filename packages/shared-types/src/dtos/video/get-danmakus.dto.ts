import { z } from 'zod/v4'

export const videoGetDanmakusDTO = z.object({
  videoId: z.string(),
})

export type VideoGetDanmakusDTO = z.infer<typeof videoGetDanmakusDTO>
