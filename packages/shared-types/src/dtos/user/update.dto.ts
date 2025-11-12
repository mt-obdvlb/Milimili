import { z } from 'zod/v4'

export const userUpdateDTO = z.object({
  name: z
    .string({ message: '用户名必须是字符串类型' })
    .trim()
    .min(4, { message: '用户名长度4-20位之间' })
    .max(20, { message: '用户名长度4-20位之间' }),
  avatar: z.url({ message: '头像必须是有效的 URL' }),
})

export type UserUpdateDTO = z.infer<typeof userUpdateDTO>
