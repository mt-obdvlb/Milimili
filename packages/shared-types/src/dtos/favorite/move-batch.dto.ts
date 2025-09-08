import { z } from 'zod/v4'

export const favoriteMoveBatchDTO = z.object({
  ids: z.array(z.string()),
  targetFolderId: z.string(),
})

export type FavoriteMoveBatchDTO = z.infer<typeof favoriteMoveBatchDTO>
