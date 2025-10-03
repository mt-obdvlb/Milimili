import { z } from 'zod/v4'

export const userUpdateDTO = z.object({
  name: z.string().min(4, '用户名长度4-20位之间').max(20, '用户名长度4-20位之间'),
  avatar: z.url(),
})

export type UserUpdateDTO = z.infer<typeof userUpdateDTO>
