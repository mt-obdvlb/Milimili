import { z } from 'zod/v4'

export const userGetByNameDTO = z.object({
  name: z
    .string({ message: '用户名必须是字符串类型' })
    .trim()
    .min(1, { message: '用户名不能为空' })
    .max(20, { message: '用户名不能超过 20 个字符' }),
})

export type UserGetByNameDTO = z.infer<typeof userGetByNameDTO>
