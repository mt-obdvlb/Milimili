import { z } from 'zod/v4'

export const userLoginDTO = z.object({
  email: z.email({ message: '请输入有效邮箱' }),
  password: z
    .string({ message: '密码必须是字符串类型' })
    .min(8, { message: '密码长度不能少于 8 位' })
    .max(20, { message: '密码长度不能超过 20 位' })
    .optional(),
  code: z
    .string({ message: '验证码必须是字符串类型' })
    .length(6, { message: '验证码必须是 6 位' })
    .optional(),
})

export type UserLoginDTO = z.infer<typeof userLoginDTO>
