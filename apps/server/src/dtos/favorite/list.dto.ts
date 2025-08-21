import { z } from 'zod/v4'

export const favoriteListDTO = z.object({
  userId: z.string(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
  favoriteFolderId: z.string(),
})

export type FavoriteListDTO = z.infer<typeof favoriteListDTO>
