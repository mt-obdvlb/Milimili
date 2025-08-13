import { z } from 'zod/v4'

export const userLoginDTO = z.object({
  email: z.email(),
  password: z.string().optional(),
  code: z.string().optional(),
})

export type UserLoginDTO = z.infer<typeof userLoginDTO>
