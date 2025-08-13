import { z } from 'zod/v4'

export const videoListDTO = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(4),
})

export type VideoListDTO = z.infer<typeof videoListDTO>
