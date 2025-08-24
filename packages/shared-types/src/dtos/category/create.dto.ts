import { z } from 'zod/v4'

export const categoryCreateDTO = z.object({
  name: z.string(),
})

export type CategoryCreateDTO = z.infer<typeof categoryCreateDTO>
