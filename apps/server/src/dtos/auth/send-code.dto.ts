import { z } from 'zod/v4'

export const authSendCodeDTO = z.object({
  email: z.email(),
})

export type AuthSendCodeDTO = z.infer<typeof authSendCodeDTO>
