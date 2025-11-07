import { z } from 'zod/v4'

export type VideoListSort = 'publishedAt' | 'views' | 'favorites'

export const videoListSpaceDTO = z.object({
  userId: z.string(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  sort: z
    .enum(['views', 'publishedAt', 'favorites'] satisfies VideoListSort[])
    .default('publishedAt'),
})

export type VideoListSpaceDTO = z.infer<typeof videoListSpaceDTO>
