import { z } from 'zod/v4'

export const favoriteDeleteBatchDTO = z.object({
  ids: z.array(z.string()),
})

export type FavoriteDeleteBatchDTO = z.infer<typeof favoriteDeleteBatchDTO>
