import { z } from 'zod/v4'

export const commentDeleteDTO = z.object({
  id: z
    .string({ message: '评论 ID 必须是字符串类型' })
    .trim()
    .min(1, { message: '评论 ID 不能为空' })
    .regex(/^[a-f\d]{24}$/i, { message: '评论 ID 格式不正确，必须是有效的 MongoDB ObjectId' }),
})

export type CommentDeleteDTO = z.infer<typeof commentDeleteDTO>
