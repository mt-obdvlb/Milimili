import { z } from 'zod/v4'

export const searchLogAddDTO = z.object({
  keyword: z.string(),
})

export type SearchLogAddDTO = z.infer<typeof searchLogAddDTO>
