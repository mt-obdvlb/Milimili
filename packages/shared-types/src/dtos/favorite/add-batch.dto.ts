import { z } from 'zod/v4'

export const favoriteAddBatchDTO = z.object({
  videoIds: z.array(z.string()),
  folderId: z.string(),
})

export type FavoriteAddBatchDTO = z.infer<typeof favoriteAddBatchDTO>
