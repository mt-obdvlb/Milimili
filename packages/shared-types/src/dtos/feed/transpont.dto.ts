import { z } from 'zod/v4'

export const feedTranspontDTO = z.object({
  content: z
    .string({ message: '转发内容必须是字符串类型' })
    .trim()
    .max(1000, { message: '转发内容不能超过 1000 个字符' })
    .optional(),
  feedId: z
    .string({ message: '动态 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '动态 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '动态 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type FeedTranspontDTO = z.infer<typeof feedTranspontDTO>
