import { z } from 'zod/v4'

export const favoriteAddDTO = z.object({
  videoId: z.string(),
  userId: z.string(),
  folderId: z.string(),
})

export type FavoriteAddDTO = z.infer<typeof favoriteAddDTO>
