import { z } from 'zod/v4'

export const categoryGetDTO = z.object({
  id: z.string(),
})

export type CategoryGetDTO = z.infer<typeof categoryGetDTO>
