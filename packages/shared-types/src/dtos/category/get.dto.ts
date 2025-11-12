import { z } from 'zod/v4'

export const categoryGetDTO = z.object({
  id: z
    .string({ message: '分类 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '分类 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '分类 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type CategoryGetDTO = z.infer<typeof categoryGetDTO>
