import { z } from 'zod/v4'

export const userAtDTO = z.object({
  keyword: z
    .string({ message: '搜索关键词必须是字符串类型' })
    .trim()
    .max(50, { message: '搜索关键词不能超过 50 个字符' })
    .optional(),
  page: z.coerce
    .number({ message: '页码必须是数字类型' })
    .min(1, { message: '页码不能小于 1' })
    .max(1000, { message: '页码不能超过 1000' })
    .default(1),
  pageSize: z.coerce
    .number({ message: '每页数量必须是数字类型' })
    .min(1, { message: '每页数量不能小于 1' })
    .max(1000, { message: '每页数量不能超过 1000' })
    .default(20),
})

export type UserAtDTO = z.infer<typeof userAtDTO>
