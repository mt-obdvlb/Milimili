import { z } from 'zod/v4'

export const userGetByEmailDTO = z.object({
  email: z.email({ message: '请输入有效邮箱' }),
})

export type UserGetByEmailDTO = z.infer<typeof userGetByEmailDTO>
