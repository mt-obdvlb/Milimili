import { z } from 'zod/v4'

export const categoryGetByNameDTO = z.object({
  name: z
    .string({ message: '名称必须是字符串类型' })
    .min(1, { message: '名称不能为空' })
    .max(20, { message: '名称不能超过 20 位' }),
})

export type CategoryGetByNameDTO = z.infer<typeof categoryGetByNameDTO>
