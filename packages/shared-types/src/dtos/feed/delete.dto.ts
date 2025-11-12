import { z } from 'zod/v4'

export const feedDeleteDTO = z.object({
  id: z
    .string({ message: '动态 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '动态 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '动态 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type FeedDeleteDTO = z.infer<typeof feedDeleteDTO>
