import { z } from 'zod/v4'

export const searchLogGetDTO = z.object({
  keyword: z.string(),
})

export type SearchLogGetDTO = z.infer<typeof searchLogGetDTO>
