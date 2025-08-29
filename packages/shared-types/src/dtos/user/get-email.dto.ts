import { z } from 'zod/v4'

export const userGetByEmailDTO = z.object({
  email: z.email(),
})

export type UserGetByEmailDTO = z.infer<typeof userGetByEmailDTO>
