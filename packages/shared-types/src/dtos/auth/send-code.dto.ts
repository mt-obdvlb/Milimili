import { z } from 'zod/v4'

export const authSendCodeDTO = z.object({
  email: z
    .email({
      message: '邮箱格式不正确，请输入有效的邮箱地址',
    })
    .min(6, { message: '邮箱长度不能少于 6 个字符' })
    .max(100, { message: '邮箱长度不能超过 100 个字符' }),
})

export type AuthSendCodeDTO = z.infer<typeof authSendCodeDTO>
