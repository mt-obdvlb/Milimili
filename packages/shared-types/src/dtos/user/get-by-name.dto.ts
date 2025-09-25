import { z } from 'zod/v4'

export const userGetByNameDTO = z.object({
  name: z.string().min(1).max(20),
})

export type UserGetByNameDTO = z.infer<typeof userGetByNameDTO>
