import { z } from 'zod/v4'

export const favoriteFolderAddDTO = z.object({
  name: z.string().min(1).max(20),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
})

export type FavoriteFolderAddDTO = z.infer<typeof favoriteFolderAddDTO>
