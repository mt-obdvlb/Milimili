import { z } from 'zod/v4'

export const userFindPasswordDTO = z
  .object({
    email: z.email({ message: '请输入有效邮箱' }),
    code: z
      .string({ message: '验证码必须是字符串类型' })
      .length(6, { message: '验证码必须是 6 位' }),
    password: z
      .string({ message: '密码必须是字符串类型' })
      .min(8, { message: '密码长度不能少于 8 位' })
      .max(20, { message: '密码长度不能超过 20 位' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        '密码需包含大写字母、小写字母、数字和特殊字符'
      ),
    confirmPassword: z
      .string({ message: '确认密码必须是字符串类型' })
      .min(8, { message: '确认密码长度不能少于 8 位' })
      .max(20, { message: '确认密码长度不能超过 20 位' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: '两次输入的密码不一致',
  })

export type UserFindPasswordDTO = z.infer<typeof userFindPasswordDTO>
