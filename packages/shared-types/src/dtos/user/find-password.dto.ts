import { z } from 'zod/v4'

export const userFindPasswordDTO = z
  .object({
    email: z.email('请输入有效邮箱'),
    code: z.string().min(6).max(6),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        '密码需包含大写字母、小写字母、数字和特殊字符的8-20位字符'
      ),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: '两次输入的密码不一致',
  })

export type UserFindPasswordDTO = z.infer<typeof userFindPasswordDTO>
